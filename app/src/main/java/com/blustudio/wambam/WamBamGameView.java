package com.blustudio.wambam;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.util.Base64;
import android.view.MotionEvent;
import android.view.View;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

public class WamBamGameView extends View {
    private static final int HOME = 0;
    private static final int GAME = 1;
    private static final int COLS = 8;
    private static final int ROWS = 8;
    private static final int START_MOVES = 16;
    private static final int TARGET = 30;

    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG);
    private final Paint text = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Random random = new Random();
    private final int[][] board = new int[COLS][ROWS];
    private final ToneGenerator tones = new ToneGenerator(AudioManager.STREAM_MUSIC, 28);

    private final int[] pieceColours = {
            Color.rgb(245, 45, 92),
            Color.rgb(255, 72, 145),
            Color.rgb(219, 31, 57),
            Color.rgb(44, 201, 222),
            Color.rgb(255, 198, 41),
            Color.rgb(238, 60, 94)
    };

    private Bitmap homeBackground;
    private Bitmap gameBackground;
    private int screen = HOME;
    private int movesLeft = START_MOVES;
    private int cleared = 0;

    private float downX;
    private float downY;
    private int downCellX = -1;
    private int downCellY = -1;
    private int selectedX = -1;
    private int selectedY = -1;

    private boolean hammerMode;
    private boolean hammerUsed;
    private boolean shuffleUsed;
    private boolean bamUsed;
    private boolean hintUsed;

    private int hintAX = -1;
    private int hintAY = -1;
    private int hintBX = -1;
    private int hintBY = -1;

    private String toast = "";
    private long toastUntil;

    private boolean modal;
    private String modalTitle = "";
    private String modalBody = "";
    private String modalButton = "OK";
    private Runnable modalAction;

    public WamBamGameView(Context context) {
        super(context);
        setKeepScreenOn(true);
        setFocusable(true);
        homeBackground = readRawBitmap(R.raw.home_bg);
        gameBackground = readRawBitmap(R.raw.game_bg);
        generateBoard();
    }

    private Bitmap readRawBitmap(int id) {
        try (InputStream in = getResources().openRawResource(id);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[2048];
            int read;
            while ((read = in.read(buffer)) != -1) out.write(buffer, 0, read);
            String encoded = new String(out.toByteArray(), StandardCharsets.UTF_8).trim();
            byte[] bytes = Base64.decode(encoded, Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (screen == HOME) drawHome(canvas);
        else drawGame(canvas);
        if (modal) drawModal(canvas);
        if (!toast.isEmpty() && System.currentTimeMillis() < toastUntil) {
            drawToast(canvas);
            postInvalidateDelayed(60);
        }
    }

    private void drawHome(Canvas canvas) {
        drawBackground(canvas, homeBackground);
    }

    private void drawGame(Canvas canvas) {
        drawBackground(canvas, gameBackground);
        paint.setColor(Color.argb(155, 0, 0, 0));
        canvas.drawRect(0, 0, getWidth(), getHeight(), paint);
        drawHud(canvas);
        drawBoard(canvas);
        drawBoosters(canvas);
    }

    private void drawBackground(Canvas canvas, Bitmap bitmap) {
        canvas.drawColor(Color.rgb(15, 12, 22));
        if (bitmap != null) {
            canvas.drawBitmap(bitmap, null, new RectF(0, 0, getWidth(), getHeight()), paint);
        }
    }

    private void drawHud(Canvas canvas) {
        float w = getWidth();
        float h = getHeight();
        drawPanel(canvas, w * .03f, h * .025f, w * .25f, h * .105f, Color.rgb(20, 20, 26));
        drawPanel(canvas, w * .31f, h * .025f, w * .67f, h * .105f, Color.rgb(20, 20, 26));
        drawPanel(canvas, w * .84f, h * .025f, w * .97f, h * .105f, Color.rgb(20, 20, 26));
        drawCentered(canvas, "MOVES\n" + movesLeft, w * .14f, h * .065f, w * .045f, Color.WHITE);
        drawCentered(canvas, "CLEAR\n" + cleared + "/" + TARGET, w * .49f, h * .065f, w * .045f, Color.WHITE);
        drawCentered(canvas, "HOME", w * .905f, h * .065f, w * .028f, Color.WHITE);
        drawCentered(canvas, "WAM BAM", w * .5f, h * .145f, w * .075f, Color.rgb(255, 198, 41));
        drawCentered(canvas, "THANK U MAM", w * .5f, h * .19f, w * .048f, Color.rgb(30, 211, 218));
    }

    private RectF boardRect() {
        float w = getWidth();
        float h = getHeight();
        float size = Math.min(w * .91f, h * .53f);
        float left = (w - size) / 2f;
        float top = h * .245f;
        return new RectF(left, top, left + size, top + size);
    }

    private void drawBoard(Canvas canvas) {
        RectF outer = boardRect();
        paint.setColor(Color.rgb(255, 198, 41));
        canvas.drawRoundRect(outer, 24, 24, paint);
        float pad = outer.width() * .018f;
        RectF inner = new RectF(outer.left + pad, outer.top + pad, outer.right - pad, outer.bottom - pad);
        paint.setColor(Color.rgb(11, 12, 17));
        canvas.drawRoundRect(inner, 18, 18, paint);

        float gap = inner.width() * .007f;
        float cell = (inner.width() - gap * 7f) / 8f;
        for (int y = 0; y < ROWS; y++) {
            for (int x = 0; x < COLS; x++) {
                float l = inner.left + x * (cell + gap);
                float t = inner.top + y * (cell + gap);
                RectF r = new RectF(l, t, l + cell, t + cell);
                paint.setColor(Color.rgb(28, 29, 36));
                canvas.drawRoundRect(r, cell * .12f, cell * .12f, paint);
                drawPiece(canvas, board[x][y], r);

                if ((x == selectedX && y == selectedY) ||
                        (x == hintAX && y == hintAY) || (x == hintBX && y == hintBY)) {
                    paint.setStyle(Paint.Style.STROKE);
                    paint.setStrokeWidth(Math.max(4f, cell * .055f));
                    paint.setColor(x == selectedX && y == selectedY ? Color.WHITE : Color.rgb(255, 218, 55));
                    canvas.drawRoundRect(r, cell * .12f, cell * .12f, paint);
                    paint.setStyle(Paint.Style.FILL);
                }
            }
        }
    }

    private void drawPiece(Canvas canvas, int kind, RectF r) {
        float cx = r.centerX();
        float cy = r.centerY();
        float s = r.width();
        paint.setColor(pieceColours[kind]);

        if (kind == 0) {
            drawCentered(canvas, "♥", cx, cy, s * .72f, pieceColours[kind]);
        } else if (kind == 1) {
            paint.setColor(Color.rgb(235, 192, 52));
            canvas.drawRoundRect(new RectF(cx - s*.12f, cy - s*.25f, cx + s*.12f, cy + s*.28f), s*.05f, s*.05f, paint);
            paint.setColor(pieceColours[kind]);
            canvas.drawRoundRect(new RectF(cx - s*.10f, cy - s*.39f, cx + s*.10f, cy - s*.12f), s*.08f, s*.08f, paint);
        } else if (kind == 2) {
            paint.setStrokeWidth(s * .04f);
            paint.setColor(Color.rgb(70, 175, 80));
            canvas.drawLine(cx, cy - s*.10f, cx - s*.12f, cy - s*.32f, paint);
            canvas.drawLine(cx, cy - s*.10f, cx + s*.12f, cy - s*.32f, paint);
            paint.setColor(pieceColours[kind]);
            canvas.drawCircle(cx - s*.15f, cy + s*.10f, s*.17f, paint);
            canvas.drawCircle(cx + s*.15f, cy + s*.10f, s*.17f, paint);
        } else if (kind == 3) {
            Path p = new Path();
            p.moveTo(cx, cy - s*.34f);
            p.lineTo(cx + s*.30f, cy);
            p.lineTo(cx, cy + s*.34f);
            p.lineTo(cx - s*.30f, cy);
            p.close();
            canvas.drawPath(p, paint);
        } else if (kind == 4) {
            drawCentered(canvas, "★", cx, cy, s * .66f, pieceColours[kind]);
        } else {
            paint.setStrokeWidth(s * .12f);
            paint.setStrokeCap(Paint.Cap.ROUND);
            canvas.drawLine(cx - s*.22f, cy - s*.20f, cx - s*.02f, cy + s*.22f, paint);
            canvas.drawLine(cx - s*.02f, cy + s*.22f, cx + s*.24f, cy + s*.22f, paint);
            canvas.drawLine(cx + s*.18f, cy + s*.22f, cx + s*.18f, cy + s*.34f, paint);
            paint.setStrokeCap(Paint.Cap.BUTT);
        }
    }

    private void drawBoosters(Canvas canvas) {
        float w = getWidth();
        float h = getHeight();
        float top = h * .86f;
        float bottom = h * .965f;
        String[] names = {"HAMMER", "SHUFFLE", "BAM!", "HINT"};
        boolean[] used = {hammerUsed, shuffleUsed, bamUsed, hintUsed};
        for (int i = 0; i < 4; i++) {
            float left = w * (.02f + i * .245f);
            float right = left + w * .225f;
            drawPanel(canvas, left, top, right, bottom, used[i] ? Color.rgb(70,70,72) : Color.rgb(8,145,160));
            drawCentered(canvas, names[i], (left + right)/2f, (top + bottom)/2f, w*.028f, Color.WHITE);
        }
    }

    private void drawPanel(Canvas canvas, float l, float t, float r, float b, int colour) {
        RectF rect = new RectF(l,t,r,b);
        paint.setColor(colour);
        canvas.drawRoundRect(rect, 22, 22, paint);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(Math.max(3f, getWidth()*.006f));
        paint.setColor(Color.rgb(255,198,41));
        canvas.drawRoundRect(rect, 22, 22, paint);
        paint.setStyle(Paint.Style.FILL);
    }

    private void drawCentered(Canvas canvas, String value, float cx, float cy, float size, int colour) {
        text.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        text.setTextAlign(Paint.Align.CENTER);
        text.setTextSize(size);
        text.setColor(colour);
        String[] lines = value.split("\\n");
        float line = size * 1.05f;
        float y = cy - ((lines.length - 1) * line)/2f - (text.ascent() + text.descent())/2f;
        for (int i=0;i<lines.length;i++) canvas.drawText(lines[i], cx, y + i*line, text);
    }

    private void drawToast(Canvas canvas) {
        float w = getWidth();
        float h = getHeight();
        RectF r = new RectF(w*.27f, h*.205f, w*.73f, h*.255f);
        paint.setColor(Color.rgb(239,20,93));
        canvas.drawRoundRect(r, 24, 24, paint);
        drawCentered(canvas, toast, r.centerX(), r.centerY(), w*.045f, Color.WHITE);
    }

    private void drawModal(Canvas canvas) {
        float w = getWidth();
        float h = getHeight();
        paint.setColor(Color.argb(205,0,0,0));
        canvas.drawRect(0,0,w,h,paint);
        RectF card = new RectF(w*.10f,h*.31f,w*.90f,h*.69f);
        paint.setColor(Color.rgb(18,20,28));
        canvas.drawRoundRect(card,32,32,paint);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(w*.008f);
        paint.setColor(Color.rgb(255,198,41));
        canvas.drawRoundRect(card,32,32,paint);
        paint.setStyle(Paint.Style.FILL);
        drawCentered(canvas, modalTitle, w*.5f,h*.39f,w*.062f,Color.rgb(239,20,93));
        drawCentered(canvas, modalBody, w*.5f,h*.49f,w*.034f,Color.WHITE);
        drawPanel(canvas,w*.18f,h*.57f,w*.62f,h*.645f,Color.rgb(239,20,93));
        drawCentered(canvas,modalButton,w*.40f,h*.607f,w*.034f,Color.WHITE);
        drawPanel(canvas,w*.66f,h*.57f,w*.84f,h*.645f,Color.rgb(8,145,160));
        drawCentered(canvas,"CLOSE",w*.75f,h*.607f,w*.028f,Color.WHITE);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        float x = event.getX();
        float y = event.getY();
        if (event.getAction() == MotionEvent.ACTION_DOWN) {
            downX = x;
            downY = y;
            if (screen == GAME && !modal) {
                int[] c = cellAt(x,y);
                downCellX = c[0];
                downCellY = c[1];
            }
            return true;
        }
        if (event.getAction() == MotionEvent.ACTION_UP) {
            if (modal) handleModal(x,y);
            else if (screen == HOME) handleHome(x,y);
            else handleGame(x,y);
            return true;
        }
        return true;
    }

    private void handleHome(float x, float y) {
        float nx = x/getWidth();
        float ny = y/getHeight();
        if (inside(nx,ny,.20f,.64f,.80f,.79f)) startLevel();
        else if (inside(nx,ny,0,.77f,.25f,.94f)) showInfo("EVENTS","Timed events coming soon.");
        else if (inside(nx,ny,.25f,.77f,.50f,.94f)) showInfo("SHOP","Coins and boosters coming soon.");
        else if (inside(nx,ny,.50f,.77f,.75f,.94f)) showChoice("CHALLENGE","Clear 30 pieces in 16 moves.","PLAY",this::startLevel);
        else if (inside(nx,ny,.75f,.77f,1f,.94f)) showInfo("SETTINGS","Sound and vibration are active.");
        else if (inside(nx,ny,.78f,0,1f,.10f)) showInfo("VIP","VIP rewards coming soon.");
        else if (inside(nx,ny,.10f,0,.48f,.10f)) showInfo("LIVES","You have 5 lives.");
        else if (inside(nx,ny,.46f,0,.80f,.10f)) showInfo("COINS","Balance: 12,450 coins.");
    }

    private void handleGame(float upX, float upY) {
        float nx = upX/getWidth();
        float ny = upY/getHeight();
        if (inside(nx,ny,.82f,0,1f,.12f)) {
            feedback(); screen = HOME; invalidate(); return;
        }
        if (ny > .84f) {
            if (nx < .25f) useHammer();
            else if (nx < .50f) useShuffle();
            else if (nx < .75f) useBam();
            else useHint();
            return;
        }
        if (downCellX < 0 || downCellY < 0) return;
        if (hammerMode) {
            hammerMode = false;
            hammerUsed = true;
            removeSingle(downCellX, downCellY);
            return;
        }
        float dx = upX-downX;
        float dy = upY-downY;
        float distance = (float)Math.sqrt(dx*dx+dy*dy);
        if (distance < getWidth()*.045f) {
            tapCell(downCellX,downCellY);
            return;
        }
        int tx = downCellX;
        int ty = downCellY;
        if (Math.abs(dx)>Math.abs(dy)) tx += dx>0?1:-1;
        else ty += dy>0?1:-1;
        if (inBounds(tx,ty)) trySwap(downCellX,downCellY,tx,ty);
    }

    private void tapCell(int x, int y) {
        if (selectedX < 0) {
            selectedX=x; selectedY=y; invalidate(); return;
        }
        if (Math.abs(selectedX-x)+Math.abs(selectedY-y)==1) {
            int sx=selectedX, sy=selectedY;
            selectedX=selectedY=-1;
            trySwap(sx,sy,x,y);
        } else {
            selectedX=x; selectedY=y; invalidate();
        }
    }

    private void trySwap(int x1,int y1,int x2,int y2) {
        swap(x1,y1,x2,y2);
        Set<Long> matches=findMatches();
        if (matches.isEmpty()) {
            swap(x1,y1,x2,y2);
            showToast("NO MATCH",500);
        } else {
            movesLeft--;
            feedback();
            resolve(matches);
            checkEnd();
        }
        invalidate();
    }

    private void resolve(Set<Long> matches) {
        while (!matches.isEmpty()) {
            cleared += matches.size();
            showToast(matches.size()>=5?"BAM!":matches.size()>=4?"WAM!":"NICE!",600);
            for (long v:matches) board[(int)(v>>32)][(int)v]=-1;
            collapse();
            matches=findMatches();
        }
        if (!findMove(null)) shuffleInternal();
    }

    private void collapse() {
        for (int x=0;x<COLS;x++) {
            int write=ROWS-1;
            for (int y=ROWS-1;y>=0;y--) if (board[x][y]>=0) board[x][write--]=board[x][y];
            while (write>=0) board[x][write--]=random.nextInt(6);
        }
    }

    private void removeSingle(int x,int y) {
        board[x][y]=-1;
        cleared++;
        feedback();
        showToast("WHACK!",600);
        collapse();
        Set<Long> cascades=findMatches();
        if (!cascades.isEmpty()) resolve(cascades);
        checkEnd();
        invalidate();
    }

    private void useHammer() {
        if (hammerUsed) { showToast("HAMMER USED",650); return; }
        hammerMode=true; feedback(); showToast("TAP A PIECE",900);
    }

    private void useShuffle() {
        if (shuffleUsed) { showToast("SHUFFLE USED",650); return; }
        shuffleUsed=true; feedback(); shuffleInternal(); showToast("SHUFFLED!",650); invalidate();
    }

    private void useBam() {
        if (bamUsed) { showToast("BAM USED",650); return; }
        bamUsed=true; feedback();
        int cx=1+random.nextInt(6), cy=1+random.nextInt(6), count=0;
        for (int y=cy-1;y<=cy+1;y++) for (int x=cx-1;x<=cx+1;x++) { board[x][y]=-1; count++; }
        cleared+=count; collapse(); showToast("BAM!",800);
        Set<Long> cascades=findMatches();
        if (!cascades.isEmpty()) resolve(cascades);
        checkEnd(); invalidate();
    }

    private void useHint() {
        if (hintUsed) { showToast("HINT USED",650); return; }
        hintUsed=true; feedback();
        int[] move=new int[4];
        if (findMove(move)) {
            hintAX=move[0]; hintAY=move[1]; hintBX=move[2]; hintBY=move[3];
            showToast("TRY THESE",1000); invalidate();
            postDelayed(() -> { hintAX=hintAY=hintBX=hintBY=-1; invalidate(); },1200);
        }
    }

    private void generateBoard() {
        for (int y=0;y<ROWS;y++) for (int x=0;x<COLS;x++) {
            ArrayList<Integer> choices=new ArrayList<>();
            for (int k=0;k<6;k++) {
                boolean h=x>=2 && board[x-1][y]==k && board[x-2][y]==k;
                boolean v=y>=2 && board[x][y-1]==k && board[x][y-2]==k;
                if (!h && !v) choices.add(k);
            }
            board[x][y]=choices.get(random.nextInt(choices.size()));
        }
        if (!findMove(null)) generateBoard();
    }

    private Set<Long> findMatches() {
        Set<Long> out=new HashSet<>();
        for (int y=0;y<ROWS;y++) {
            int s=0;
            while (s<COLS) {
                int k=board[s][y], e=s+1;
                while (e<COLS && board[e][y]==k) e++;
                if (k>=0 && e-s>=3) for (int x=s;x<e;x++) out.add(pack(x,y));
                s=e;
            }
        }
        for (int x=0;x<COLS;x++) {
            int s=0;
            while (s<ROWS) {
                int k=board[x][s], e=s+1;
                while (e<ROWS && board[x][e]==k) e++;
                if (k>=0 && e-s>=3) for (int y=s;y<e;y++) out.add(pack(x,y));
                s=e;
            }
        }
        return out;
    }

    private boolean findMove(int[] result) {
        for (int y=0;y<ROWS;y++) for (int x=0;x<COLS;x++) {
            int[][] d={{1,0},{0,1}};
            for (int[] v:d) {
                int nx=x+v[0], ny=y+v[1];
                if (!inBounds(nx,ny)) continue;
                swap(x,y,nx,ny);
                boolean ok=!findMatches().isEmpty();
                swap(x,y,nx,ny);
                if (ok) {
                    if (result!=null) { result[0]=x; result[1]=y; result[2]=nx; result[3]=ny; }
                    return true;
                }
            }
        }
        return false;
    }

    private void shuffleInternal() {
        List<Integer> values=new ArrayList<>();
        for (int y=0;y<ROWS;y++) for (int x=0;x<COLS;x++) values.add(board[x][y]<0?random.nextInt(6):board[x][y]);
        int guard=0;
        do {
            Collections.shuffle(values,random);
            int n=0;
            for (int y=0;y<ROWS;y++) for (int x=0;x<COLS;x++) board[x][y]=values.get(n++);
            guard++;
        } while ((!findMatches().isEmpty() || !findMove(null)) && guard<100);
        if (guard>=100) generateBoard();
    }

    private int[] cellAt(float x,float y) {
        RectF outer=boardRect();
        float pad=outer.width()*.018f;
        RectF inner=new RectF(outer.left+pad,outer.top+pad,outer.right-pad,outer.bottom-pad);
        if (!inner.contains(x,y)) return new int[]{-1,-1};
        float gap=inner.width()*.007f;
        float cell=(inner.width()-gap*7f)/8f;
        int cx=(int)((x-inner.left)/(cell+gap));
        int cy=(int)((y-inner.top)/(cell+gap));
        return inBounds(cx,cy)?new int[]{cx,cy}:new int[]{-1,-1};
    }

    private void startLevel() {
        screen=GAME; movesLeft=START_MOVES; cleared=0;
        selectedX=selectedY=-1; hammerMode=false;
        hammerUsed=shuffleUsed=bamUsed=hintUsed=false;
        hintAX=hintAY=hintBX=hintBY=-1;
        modal=false; generateBoard(); feedback(); invalidate();
    }

    private void checkEnd() {
        if (cleared>=TARGET) showChoice("WAM! YOU WON","Level complete.","PLAY AGAIN",this::startLevel);
        else if (movesLeft<=0) showChoice("OUT OF MOVES",cleared+" of "+TARGET+" cleared.","TRY AGAIN",this::startLevel);
    }

    private void showInfo(String title,String body) { showChoice(title,body,"OK",() -> {}); }

    private void showChoice(String title,String body,String button,Runnable action) {
        modalTitle=title; modalBody=body; modalButton=button; modalAction=action; modal=true; feedback(); invalidate();
    }

    private void handleModal(float x,float y) {
        float nx=x/getWidth(), ny=y/getHeight();
        if (inside(nx,ny,.18f,.57f,.62f,.645f)) {
            Runnable action=modalAction; modal=false; modalAction=null; feedback(); if (action!=null) action.run(); invalidate();
        } else if (inside(nx,ny,.66f,.57f,.84f,.645f)) {
            modal=false; modalAction=null; feedback(); invalidate();
        }
    }

    private void showToast(String value,long ms) {
        toast=value; toastUntil=System.currentTimeMillis()+ms; invalidate();
    }

    private void feedback() {
        tones.startTone(ToneGenerator.TONE_PROP_BEEP,40);
        try {
            if (Build.VERSION.SDK_INT>=31) {
                VibratorManager manager=(VibratorManager)getContext().getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
                if (manager!=null) manager.getDefaultVibrator().vibrate(VibrationEffect.createOneShot(16,VibrationEffect.DEFAULT_AMPLITUDE));
            } else {
                Vibrator vibrator=(Vibrator)getContext().getSystemService(Context.VIBRATOR_SERVICE);
                if (vibrator!=null && vibrator.hasVibrator()) vibrator.vibrate(VibrationEffect.createOneShot(16,VibrationEffect.DEFAULT_AMPLITUDE));
            }
        } catch (Exception ignored) {}
    }

    private boolean inside(float x,float y,float l,float t,float r,float b) { return x>=l && x<=r && y>=t && y<=b; }
    private boolean inBounds(int x,int y) { return x>=0 && x<COLS && y>=0 && y<ROWS; }
    private void swap(int x1,int y1,int x2,int y2) { int v=board[x1][y1]; board[x1][y1]=board[x2][y2]; board[x2][y2]=v; }
    private long pack(int x,int y) { return (((long)x)<<32) | (y & 0xffffffffL); }

    @Override
    protected void onDetachedFromWindow() {
        tones.release();
        super.onDetachedFromWindow();
    }
}
