#!/usr/bin/env python3
from pathlib import Path
import re
import sys


def replace_required(text, old, new, label, minimum=1):
    count = text.count(old)
    if count < minimum:
        raise RuntimeError(f"{label}: expected at least {minimum}, found {count}")
    return text.replace(old, new)


def patch(text):
    marker = 'const ID = "wambam-alpha02-overlay";'
    start = text.find(marker)
    if start < 0:
        raise RuntimeError("Wam Bam gameplay overlay not found")

    end_marker = 'openIncomingCurtain();\n})();'
    end = text.find(end_marker, start)
    if end < 0:
        raise RuntimeError("Wam Bam gameplay overlay end not found")
    end += len(end_marker)

    prefix = text[:start]
    game = text[start:end]
    suffix = text[end:]

    game = replace_required(
        game,
        'const levelConfig = level => LEVEL_CONFIGS[level] || LEVEL_CONFIGS[1];',
        'const levelConfig = level => LEVEL_CONFIGS[level] || LEVEL_CONFIGS[1];\n  const boardRowsForLevel = level => level === 1 ? 11 : 8;',
        'board row helper'
    )

    game = replace_required(
        game,
        '    st.coinsEl = label(76.8,2.65,14.4,3.05);\n    st.coinsEl.style.fontSize = "clamp(13px,2.05vw,22px)";\n    st.livesEl = label(87.3,9.05,8.0,3.7);\n    st.livesEl.style.fontSize = "clamp(17px,2.55vw,27px)";\n    st.livesEl.style.lineHeight = "1";',
        '    st.coinsEl = st.level === 1 ? null : label(76.8,2.65,14.4,3.05);\n    if (st.coinsEl) st.coinsEl.style.fontSize = "clamp(13px,2.05vw,22px)";\n    st.livesEl = st.level === 1 ? null : label(87.3,9.05,8.0,3.7);\n    if (st.livesEl) st.livesEl.style.fontSize = "clamp(17px,2.55vw,27px)";\n    if (st.livesEl) st.livesEl.style.lineHeight = "1";',
        'Level 1 coin and heart HUD removal'
    )

    game = replace_required(
        game,
        '    const targetRows = [25.1,29.0,32.9];',
        '    const targetRows = st.level === 1 ? [8.4,12.5,16.6] : [25.1,29.0,32.9];',
        'Level 1 target rows'
    )
    game = replace_required(
        game,
        '      if (st.level === 3 || st.level === 5) {',
        '      if (st.level === 1 || st.level === 3 || st.level === 5) {',
        'Level 1 target icons'
    )
    game = replace_required(game, '          left: "5.8%",', '          left: st.level === 1 ? "78.5%" : "5.8%",', 'target icon left')
    game = replace_required(game, '          top: `${targetRows[index] - .8}%`,', '          top: `${targetRows[index] - (st.level === 1 ? .7 : .8)}%`,', 'target icon top')
    game = replace_required(game, '          width: "7%",', '          width: st.level === 1 ? "7.8%" : "7%",', 'target icon width')
    game = replace_required(game, '          height: "3.6%",', '          height: st.level === 1 ? "3.1%" : "3.6%",', 'target icon height')
    game = replace_required(
        game,
        '      st.targetEls[key] = label(13.0,targetRows[index] - .25,7.2,2.5,"#171717");',
        '      st.targetEls[key] = st.level === 1\n        ? label(87.1,targetRows[index] - .25,7.0,2.5,"#171717")\n        : label(13.0,targetRows[index] - .25,7.2,2.5,"#171717");',
        'Level 1 target numbers'
    )

    game = replace_required(
        game,
        '      ? {left:14.1, top:38.0, width:74.0, height:45.7}',
        '      ? {left:14.1, top:21.2, width:74.0, height:62.3}',
        'Level 1 board alignment'
    )
    game = replace_required(
        game,
        '    board.style.gridTemplateRows = "repeat(8,1fr)";',
        '    board.style.gridTemplateRows = `repeat(${boardRowsForLevel(st.level)},1fr)`;',
        '11-cell-deep grid'
    )
    game = replace_required(
        game,
        '    board.style.transition = "all 180ms ease";',
        '    board.style.transition = st.level === 1 ? "none" : "all 180ms ease";',
        'board transition optimization'
    )

    # Level 1 keeps eight cells across to match the supplied artwork and grows
    # to eleven cells vertically. Other levels stay at eight by eight.
    game = re.sub(r'\brr\s*<\s*8\b', 'rr < boardRowsForLevel(st.level)', game)
    game = re.sub(r'\br\s*<\s*8\b', 'r < boardRowsForLevel(st.level)', game)
    game = re.sub(r'\br\s*<\s*7\b', 'r < boardRowsForLevel(st.level) - 1', game)

    game = replace_required(
        game,
        'while (end < 8 && matchValue(end,c) === value) end++;',
        'while (end < boardRowsForLevel(st.level) && matchValue(end,c) === value) end++;',
        'vertical match end',
        minimum=2
    )
    game = replace_required(
        game,
        'st.board = Array.from({length:8}, () => Array(8).fill(0));',
        'st.board = Array.from({length:boardRowsForLevel(st.level)}, () => Array(8).fill(0));',
        'board creation'
    )
    game = replace_required(
        game,
        'for (let r = 7; r >= 1; r--) {',
        'for (let r = boardRowsForLevel(st.level) - 1; r >= 1; r--) {',
        'falling bottom row'
    )
    game = replace_required(game, '        let write=7;', '        let write=boardRowsForLevel(st.level) - 1;', 'collapse write row')
    game = replace_required(game, '        for(let r=7;r>=0;r--){', '        for(let r=boardRowsForLevel(st.level)-1;r>=0;r--){', 'collapse scan rows')

    game = replace_required(
        game,
        '        damageHandbags([\n          ...Array.from({length:8},(_,i)=>handbagKey(r,i)),\n          ...Array.from({length:8},(_,i)=>handbagKey(i,c))\n        ]);\n        for (let i=0;i<8;i++) {\n          st.board[r][i] = null;\n          st.board[i][c] = null;\n        }',
        '        damageHandbags([\n          ...Array.from({length:8},(_,i)=>handbagKey(r,i)),\n          ...Array.from({length:boardRowsForLevel(st.level)},(_,i)=>handbagKey(i,c))\n        ]);\n        for (let i=0;i<8;i++) st.board[r][i] = null;\n        for (let i=0;i<boardRowsForLevel(st.level);i++) st.board[i][c] = null;',
        'rocket row and column sizes'
    )

    settle_anchor = '      const cols = columns && columns.length\n        ? [...new Set(columns)]\n        : [0,1,2,3,4,5,6,7];\n\n      // Candy-Crush-style loop:'
    settle_fast = '      const cols = columns && columns.length\n        ? [...new Set(columns)]\n        : [0,1,2,3,4,5,6,7];\n\n      if (st.level === 1) {\n        st.dropMoves = collapse(cols);\n        st.dropColumns = cols;\n        st.dropAnimating = true;\n        render();\n        await new Promise(res => setTimeout(res, 125));\n        st.dropAnimating = false;\n        st.dropMoves = [];\n        st.dropColumns = [];\n        render();\n        return;\n      }\n\n      // Candy-Crush-style loop:'
    game = replace_required(game, settle_anchor, settle_fast, 'fast Level 1 falling pieces')

    game = replace_required(
        game,
        '      st.coinsEl.textContent=st.coins.toLocaleString();\n      st.livesEl.textContent=st.lives;',
        '      if (st.coinsEl) st.coinsEl.textContent=st.coins.toLocaleString();\n      if (st.livesEl) st.livesEl.textContent=st.lives;',
        'HUD render guards'
    )
    game = replace_required(
        game,
        '      board.innerHTML="";',
        '      board.innerHTML="";\n      const boardFragment = document.createDocumentFragment();',
        'render fragment start'
    )
    game = replace_required(
        game,
        '          b.style.backgroundSize = bagState\n            ? (bagState === 1 ? "86% auto" : "82% auto")\n            : iconFit[pieceKey] || "108% 108%";',
        '          b.style.backgroundSize = bagState\n            ? (bagState === 1 ? "86% auto" : "82% auto")\n            : st.level === 1\n              ? "82% auto"\n              : iconFit[pieceKey] || "108% 108%";',
        'Level 1 icon fit'
    )
    game = replace_required(
        game,
        '          b.style.transform=bagState ? "scale(.9)" : "scale(.78)";',
        '          b.style.transform=bagState ? "scale(.9)" : st.level === 1 ? "scale(.94)" : "scale(.78)";',
        'Level 1 tile scale'
    )
    game = replace_required(
        game,
        '          b.style.transition="transform 180ms ease, opacity 180ms ease";',
        '          b.style.transition=st.level === 1 ? "transform 120ms ease, opacity 120ms ease" : "transform 180ms ease, opacity 180ms ease";',
        'Level 1 tile transition'
    )
    game = replace_required(
        game,
        '          board.appendChild(b);\n        }\n      }\n    }\n\n    makeBoard();',
        '          boardFragment.appendChild(b);\n        }\n      }\n      board.appendChild(boardFragment);\n    }\n\n    makeBoard();',
        'render fragment finish'
    )

    checks = [
        'boardRowsForLevel = level => level === 1 ? 11 : 8',
        '? {left:14.1, top:21.2, width:74.0, height:62.3}',
        'repeat(${boardRowsForLevel(st.level)},1fr)',
        'st.coinsEl = st.level === 1 ? null',
        'st.livesEl = st.level === 1 ? null',
        'boardFragment.appendChild(b)'
    ]
    for check in checks:
        if check not in game:
            raise RuntimeError(f"Patch validation failed: {check}")

    return prefix + game + suffix


def main():
    if len(sys.argv) != 2:
        raise SystemExit('Usage: patch_level1_gdevelop.py <game-overlay-or-code2.js>')
    path = Path(sys.argv[1])
    original = path.read_text(encoding='utf-8')
    updated = patch(original)
    path.write_text(updated, encoding='utf-8')
    print(f"Patched {path}")


if __name__ == '__main__':
    main()
