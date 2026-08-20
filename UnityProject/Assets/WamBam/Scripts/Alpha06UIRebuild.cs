using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace WamBamThankUMam
{
    [DefaultExecutionOrder(30000)]
    public sealed class Alpha06UIRebuild : MonoBehaviour
    {
        static readonly Color HotPink = new Color(0.94f, 0.03f, 0.31f, 1f);
        static readonly Color DeepPink = new Color(0.55f, 0.01f, 0.15f, 1f);
        static readonly Color Cyan = new Color(0.02f, 0.76f, 0.82f, 1f);
        static readonly Color Gold = new Color(1.00f, 0.66f, 0.08f, 1f);
        static readonly Color Cream = new Color(1.00f, 0.91f, 0.72f, 1f);
        static readonly Color Dark = new Color(0.035f, 0.025f, 0.055f, 1f);
        static readonly Color Navy = new Color(0.02f, 0.04f, 0.11f, 1f);

        Font font;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void Install()
        {
            if (FindFirstObjectByType<Alpha06UIRebuild>() != null) return;
            var go = new GameObject("Alpha 0.6 UI Rebuild");
            DontDestroyOnLoad(go);
            go.AddComponent<Alpha06UIRebuild>();
        }

        IEnumerator Start()
        {
            font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");

            while (true)
            {
                var home = FindObject("Home Screen");
                var game = FindObject("Game Screen");

                if (home != null && home.transform.Find("Alpha06 Home") == null)
                    BuildHome(home.transform);

                if (game != null && game.transform.Find("Alpha06 Game") == null)
                    BuildGame(game.transform);

                yield return new WaitForSecondsRealtime(0.2f);
            }
        }

        void BuildHome(Transform home)
        {
            HideOldArtwork(home);

            var root = NewRect("Alpha06 Home", home);
            Stretch(root);
            root.SetAsFirstSibling();

            MakeImage("Background", root, Navy, 0, 0, 864, 1536);
            MakeImage("Top Glow", root, new Color(0.45f, 0.00f, 0.17f, 1f), 0, 0, 864, 330);
            MakeImage("City Glow", root, new Color(0.02f, 0.14f, 0.24f, 1f), 0, 330, 864, 780);
            MakeImage("Lounge Floor", root, new Color(0.12f, 0.02f, 0.08f, 1f), 0, 1110, 864, 426);

            AddNeonBar(root, 22, 450, 8, 610, HotPink);
            AddNeonBar(root, 834, 440, 8, 620, Cyan);
            AddNeonBar(root, 110, 1060, 644, 5, Gold);

            var badge = MakePanel("Title Burst", root, 110, 150, 644, 480, Cream, Gold, 7);
            MakeTitle(badge, "WAM", 60, HotPink, 0.08f, 0.66f, 0.92f, 0.95f);
            MakeTitle(badge, "BAM", 76, Gold, 0.08f, 0.38f, 0.92f, 0.72f);
            MakeTitle(badge, "THANK U MAM", 38, Cyan, 0.08f, 0.15f, 0.92f, 0.43f);

            var leftSign = MakePanel("Left Sign", root, 36, 680, 260, 185, Dark, HotPink, 5);
            MakeTitle(leftSign, "THE\nBAM LOUNGE", 27, Color.white, 0.06f, 0.12f, 0.94f, 0.88f);

            var rightSign = MakePanel("Right Sign", root, 568, 670, 260, 195, Dark, Cyan, 5);
            MakeTitle(rightSign, "GOOD VIBES\nBIG COMBOS!", 26, Color.white, 0.05f, 0.12f, 0.95f, 0.88f);

            StyleHomeButton("PLAY", HotPink, 46);
            StyleHomeButton("EVENTS", Cyan, 25);
            StyleHomeButton("SHOP", Gold, 25);
            StyleHomeButton("CHALLENGES", HotPink, 22);
            StyleHomeButton("SETTINGS", Cyan, 24);
            StyleHomeButton("VIP", Gold, 24);

            MakeTopStat(root, "HOME LIVES", 32, 60, 270, 80, "5  FULL", HotPink);
            MakeTopStat(root, "HOME COINS", 450, 60, 300, 80, "12,450  +", Gold);
        }

        void BuildGame(Transform game)
        {
            HideOldArtwork(game);

            var root = NewRect("Alpha06 Game", game);
            Stretch(root);
            root.SetAsFirstSibling();

            MakeImage("Background", root, Navy, 0, 0, 864, 1536);
            MakeImage("Comic Header", root, new Color(0.42f, 0.00f, 0.11f, 1f), 0, 0, 864, 560);
            MakeImage("Lounge Left", root, new Color(0.12f, 0.01f, 0.08f, 1f), 0, 560, 110, 780);
            MakeImage("Lounge Right", root, new Color(0.05f, 0.06f, 0.16f, 1f), 770, 560, 94, 780);
            MakeImage("Bottom Strip", root, new Color(0.30f, 0.00f, 0.08f, 1f), 0, 1320, 864, 216);

            AddNeonBar(root, 16, 560, 7, 770, HotPink);
            AddNeonBar(root, 841, 560, 7, 770, Cyan);

            var logo = MakePanel("Gameplay Logo", root, 205, 120, 454, 340, Cream, Gold, 6);
            MakeTitle(logo, "WAM", 49, HotPink, 0.05f, 0.66f, 0.95f, 0.95f);
            MakeTitle(logo, "BAM", 61, Gold, 0.05f, 0.36f, 0.95f, 0.72f);
            MakeTitle(logo, "THANK U MAM", 31, Cyan, 0.05f, 0.11f, 0.95f, 0.42f);

            MakeTitle(root, "LIPSTICK\nLOUNGE", 20, Color.white, 0.01f, 0.54f, 0.12f, 0.70f);
            MakeTitle(root, "BAM!", 25, Color.white, 0.88f, 0.54f, 0.99f, 0.70f);

            RestyleHudBox("Moves BG", HotPink, Gold, 48);
            RestyleHudBox("Coins BG", Dark, Gold, 28);
            RestyleHudBox("Lives BG", HotPink, Gold, 34);

            RestyleGoal("Cherry Goal BG");
            RestyleGoal("Diamond Goal BG");
            RestyleGoal("Star Goal BG");

            RestyleCount("Rocket Count BG");
            RestyleCount("Hammer Count BG");
            RestyleCount("Disco Count BG");
            RestyleCount("Swap Count BG");

            StyleRuntimeButton("Rocket", Cyan, "ROCKET", 19);
            StyleRuntimeButton("Hammer", Cyan, "HAMMER", 19);
            StyleRuntimeButton("Disco", Cyan, "DISCO BALL", 17);
            StyleRuntimeButton("Swap", Cyan, "SWAP", 19);
            StyleRuntimeButton("Pause", HotPink, "II", 26);

            var boardCover = FindObject("Live Board Cover");
            if (boardCover != null)
            {
                var img = boardCover.GetComponent<Image>();
                if (img != null) img.color = new Color(0.02f, 0.02f, 0.03f, 0.96f);
                AddOutline(boardCover, Gold, 3f);
            }
        }

        void HideOldArtwork(Transform parent)
        {
            foreach (Transform t in parent.GetComponentsInChildren<Transform>(true))
            {
                var n = t.gameObject.name.ToLowerInvariant();
                if (n.Contains("reference artwork") ||
                    n.Contains("exact menu artwork") ||
                    n.Contains("exact gameplay artwork"))
                {
                    var img = t.GetComponent<Image>();
                    if (img != null) img.enabled = false;
                }
            }
        }

        void StyleHomeButton(string name, Color fill, int size)
        {
            StyleRuntimeButton(name, fill, name, size);
        }

        void StyleRuntimeButton(string name, Color fill, string label, int size)
        {
            var go = FindObject(name);
            if (go == null) return;

            var img = go.GetComponent<Image>();
            if (img != null) img.color = new Color(1, 1, 1, 0.001f);

            var old = go.transform.Find("Alpha06 Visual");
            if (old != null) Destroy(old.gameObject);

            var visual = NewRect("Alpha06 Visual", go.transform);
            Stretch(visual);

            var border = visual.gameObject.AddComponent<Image>();
            border.color = Gold;
            border.raycastTarget = false;

            var inner = NewRect("Inner", visual);
            inner.anchorMin = Vector2.zero;
            inner.anchorMax = Vector2.one;
            inner.offsetMin = new Vector2(5, 5);
            inner.offsetMax = new Vector2(-5, -5);
            var innerImg = inner.gameObject.AddComponent<Image>();
            innerImg.color = fill;
            innerImg.raycastTarget = false;

            var text = MakeText(inner, label, size, Color.white);
            Stretch(text.rectTransform);
            var outline = text.gameObject.AddComponent<Outline>();
            outline.effectColor = Color.black;
            outline.effectDistance = new Vector2(2, -2);
        }

        void RestyleHudBox(string name, Color fill, Color border, int size)
        {
            var go = FindObject(name);
            if (go == null) return;

            var img = go.GetComponent<Image>();
            if (img != null) img.color = border;

            var inner = go.transform.Find("Alpha06 Inner");
            if (inner == null)
            {
                var r = NewRect("Alpha06 Inner", go.transform);
                r.anchorMin = Vector2.zero;
                r.anchorMax = Vector2.one;
                r.offsetMin = new Vector2(5, 5);
                r.offsetMax = new Vector2(-5, -5);
                var ii = r.gameObject.AddComponent<Image>();
                ii.color = fill;
                ii.raycastTarget = false;
                r.SetAsFirstSibling();
            }

            var text = go.GetComponentInChildren<Text>(true);
            if (text != null)
            {
                text.transform.SetAsLastSibling();
                text.color = Color.white;
                text.fontStyle = FontStyle.Bold;
                text.resizeTextForBestFit = true;
                text.resizeTextMaxSize = size;
                var outline = text.GetComponent<Outline>();
                if (outline == null) outline = text.gameObject.AddComponent<Outline>();
                outline.effectColor = Color.black;
                outline.effectDistance = new Vector2(2, -2);
            }
        }

        void RestyleGoal(string name)
        {
            var go = FindObject(name);
            if (go == null) return;
            var img = go.GetComponent<Image>();
            if (img != null) img.color = Cream;

            var text = go.GetComponentInChildren<Text>(true);
            if (text != null)
            {
                text.color = Color.black;
                text.fontStyle = FontStyle.Bold;
                text.resizeTextForBestFit = true;
                text.resizeTextMaxSize = 28;
            }
        }

        void RestyleCount(string name)
        {
            var go = FindObject(name);
            if (go == null) return;
            var img = go.GetComponent<Image>();
            if (img != null) img.color = HotPink;
            var text = go.GetComponentInChildren<Text>(true);
            if (text != null)
            {
                text.color = Color.white;
                text.fontStyle = FontStyle.Bold;
            }
        }

        void MakeTopStat(Transform parent, string name, float x, float y, float w, float h, string value, Color fill)
        {
            var p = MakePanel(name, parent, x, y, w, h, fill, Gold, 5);
            MakeTitle(p, value, 30, Color.white, 0.05f, 0.08f, 0.95f, 0.92f);
        }

        RectTransform MakePanel(string name, Transform parent, float x, float y, float w, float h, Color fill, Color border, int borderSize)
        {
            var outer = NewRect(name, parent);
            RefRect(outer, x, y, w, h);
            outer.gameObject.AddComponent<Image>().color = border;

            var inner = NewRect("Inner", outer);
            inner.anchorMin = Vector2.zero;
            inner.anchorMax = Vector2.one;
            inner.offsetMin = new Vector2(borderSize, borderSize);
            inner.offsetMax = new Vector2(-borderSize, -borderSize);
            inner.gameObject.AddComponent<Image>().color = fill;
            return outer;
        }

        void MakeTitle(Transform parent, string value, int size, Color color, float ax0, float ay0, float ax1, float ay1)
        {
            var text = MakeText(parent, value, size, color);
            text.rectTransform.anchorMin = new Vector2(ax0, ay0);
            text.rectTransform.anchorMax = new Vector2(ax1, ay1);
            text.rectTransform.offsetMin = Vector2.zero;
            text.rectTransform.offsetMax = Vector2.zero;
            var outline = text.gameObject.AddComponent<Outline>();
            outline.effectColor = Color.black;
            outline.effectDistance = new Vector2(3, -3);
        }

        void AddNeonBar(Transform parent, float x, float y, float w, float h, Color color)
        {
            MakeImage("Neon", parent, color, x, y, w, h);
        }

        void MakeImage(string name, Transform parent, Color color, float x, float y, float w, float h)
        {
            var r = NewRect(name, parent);
            RefRect(r, x, y, w, h);
            var img = r.gameObject.AddComponent<Image>();
            img.color = color;
            img.raycastTarget = false;
        }

        Text MakeText(Transform parent, string value, int size, Color color)
        {
            var go = new GameObject("Text", typeof(RectTransform), typeof(CanvasRenderer), typeof(Text));
            go.transform.SetParent(parent, false);
            var t = go.GetComponent<Text>();
            t.font = font;
            t.text = value;
            t.fontSize = size;
            t.fontStyle = FontStyle.Bold;
            t.alignment = TextAnchor.MiddleCenter;
            t.color = color;
            t.resizeTextForBestFit = true;
            t.resizeTextMinSize = 9;
            t.resizeTextMaxSize = size;
            t.raycastTarget = false;
            return t;
        }

        void AddOutline(GameObject target, Color color, float size)
        {
            var outline = target.GetComponent<Outline>();
            if (outline == null) outline = target.AddComponent<Outline>();
            outline.effectColor = color;
            outline.effectDistance = new Vector2(size, -size);
        }

        static RectTransform NewRect(string name, Transform parent)
        {
            var go = new GameObject(name, typeof(RectTransform));
            go.transform.SetParent(parent, false);
            return go.GetComponent<RectTransform>();
        }

        static void Stretch(RectTransform r)
        {
            r.anchorMin = Vector2.zero;
            r.anchorMax = Vector2.one;
            r.offsetMin = Vector2.zero;
            r.offsetMax = Vector2.zero;
        }

        static void RefRect(RectTransform r, float x, float y, float w, float h, float rw = 864f, float rh = 1536f)
        {
            r.anchorMin = new Vector2(x / rw, 1f - (y + h) / rh);
            r.anchorMax = new Vector2((x + w) / rw, 1f - y / rh);
            r.offsetMin = Vector2.zero;
            r.offsetMax = Vector2.zero;
        }

        static GameObject FindObject(string exactName)
        {
            var transforms = FindObjectsByType<Transform>(FindObjectsInactive.Include, FindObjectsSortMode.None);
            foreach (var t in transforms)
                if (t != null && t.gameObject.name == exactName)
                    return t.gameObject;
            return null;
        }
    }
}
