using System;
using System.Collections;
using System.Reflection;
using UnityEngine;
using UnityEngine.UI;

namespace WamBamThankUMam
{
    [DefaultExecutionOrder(20000)]
    public sealed class FunctionalScreenRemake : MonoBehaviour
    {
        WamBamGame game;
        bool homeBuilt;
        bool gameBuilt;

        static readonly Color Gold = new Color(1f, 0.67f, 0.08f, 1f);
        static readonly Color Pink = new Color(0.93f, 0.03f, 0.32f, 0.98f);
        static readonly Color Teal = new Color(0.02f, 0.72f, 0.80f, 0.98f);
        static readonly Color Dark = new Color(0.045f, 0.035f, 0.055f, 0.98f);
        static readonly Color Cream = new Color(1f, 0.91f, 0.74f, 0.98f);

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void Install()
        {
            if (FindFirstObjectByType<FunctionalScreenRemake>() != null) return;
            var go = new GameObject("Wam Bam Functional UI");
            DontDestroyOnLoad(go);
            go.AddComponent<FunctionalScreenRemake>();
        }

        IEnumerator Start()
        {
            while (game == null)
            {
                game = FindFirstObjectByType<WamBamGame>();
                yield return null;
            }

            while (!homeBuilt || !gameBuilt)
            {
                DisableOldHudBlendFixes();
                if (!homeBuilt) homeBuilt = BuildHome();
                if (!gameBuilt) gameBuilt = BuildGame();
                yield return new WaitForSecondsRealtime(0.2f);
            }

            StartCoroutine(UpdateHomeStats());
        }

        void DisableOldHudBlendFixes()
        {
            var components = FindObjectsByType<MonoBehaviour>(FindObjectsInactive.Include, FindObjectsSortMode.None);
            foreach (var c in components)
            {
                if (c == null) continue;
                if (c.GetType().Name == "HudBlendFix") c.enabled = false;
            }
        }

        bool BuildHome()
        {
            var home = FindByName("Home");
            if (home == null) return false;
            if (home.transform.Find("Functional Home UI") != null) return true;

            var overlay = NewRect("Functional Home UI", home.transform);
            Stretch(overlay);

            StyleExistingButton("PLAY", Pink, "PLAY", 52);
            StyleExistingButton("EVENTS", Teal, "EVENTS", 27);
            StyleExistingButton("SHOP", Gold, "SHOP", 27);
            StyleExistingButton("CHALLENGES", Pink, "CHALLENGES", 24);
            StyleExistingButton("SETTINGS", Teal, "SETTINGS", 25);
            StyleExistingButton("VIP", Gold, "VIP", 25);

            CreatePanel(overlay, "HomeLives", 40, 55, 260, 72, Dark, Gold, 5);
            var heart = MakeText(overlay, "♥  5  FULL", 31, Color.white);
            RefRect(heart.rectTransform, 48, 62, 244, 58);

            CreatePanel(overlay, "HomeCoins", 405, 55, 300, 72, Dark, Gold, 5);
            var coins = MakeText(overlay, "●  12,450   +", 30, Color.white);
            coins.gameObject.name = "FunctionalHomeCoinsText";
            RefRect(coins.rectTransform, 415, 63, 280, 56);

            CreatePanel(overlay, "HomeVIP", 715, 55, 110, 72, Gold, Color.white, 3);

            return true;
        }

        bool BuildGame()
        {
            var screen = FindByName("Game");
            if (screen == null) return false;
            if (screen.transform.Find("Functional Game UI") != null) return true;

            var overlay = NewRect("Functional Game UI", screen.transform);
            Stretch(overlay);

            ReplaceHudBox("MovesBG", Pink, Gold, Color.white, 50, 5);
            ReplaceHudBox("CoinsBG", Dark, Gold, Color.white, 30, 4);
            ReplaceHudBox("LivesBG", Pink, Gold, Color.white, 38, 4);

            BuildTargetCard(screen.transform);

            StyleBooster("Rocket", Teal, "ROCKET");
            StyleBooster("Hammer", Teal, "HAMMER");
            StyleBooster("Disco", Teal, "DISCO BALL");
            StyleBooster("Swap", Teal, "SWAP");
            StyleExistingButton("Pause", Pink, "Ⅱ", 36);

            return true;
        }

        void ReplaceHudBox(string objectName, Color inner, Color border, Color textColor, int fontSize, int borderSize)
        {
            var go = FindByName(objectName);
            if (go == null) return;

            var original = go.GetComponent<Image>();
            if (original != null)
            {
                original.enabled = true;
                original.color = border;
                original.raycastTarget = false;
            }

            var innerRect = NewRect("Inner", go.transform);
            innerRect.anchorMin = Vector2.zero;
            innerRect.anchorMax = Vector2.one;
            innerRect.offsetMin = new Vector2(borderSize, borderSize);
            innerRect.offsetMax = new Vector2(-borderSize, -borderSize);
            var innerImage = innerRect.gameObject.AddComponent<Image>();
            innerImage.color = inner;
            innerImage.raycastTarget = false;

            var text = go.GetComponentInChildren<Text>(true);
            if (text != null)
            {
                text.transform.SetAsLastSibling();
                text.color = textColor;
                text.fontStyle = FontStyle.Bold;
                text.resizeTextForBestFit = true;
                text.resizeTextMaxSize = fontSize;

                var outline = text.GetComponent<Outline>();
                if (outline == null) outline = text.gameObject.AddComponent<Outline>();
                outline.effectColor = new Color(0f, 0f, 0f, 0.85f);
                outline.effectDistance = new Vector2(2f, -2f);
            }
        }

        void BuildTargetCard(Transform screen)
        {
            var card = NewRect("Functional Target Card", screen);
            RefRect(card, 30, 340, 185, 240);
            var bg = card.gameObject.AddComponent<Image>();
            bg.color = Gold;

            var inner = NewRect("Inner", card);
            inner.anchorMin = Vector2.zero;
            inner.anchorMax = Vector2.one;
            inner.offsetMin = new Vector2(5, 5);
            inner.offsetMax = new Vector2(-5, -5);
            inner.gameObject.AddComponent<Image>().color = Cream;

            var title = MakeText(card, "TARGET", 26, Color.white);
            title.fontStyle = FontStyle.Bold;
            title.rectTransform.anchorMin = new Vector2(0.08f, 0.77f);
            title.rectTransform.anchorMax = new Vector2(0.92f, 0.98f);
            title.rectTransform.offsetMin = title.rectTransform.offsetMax = Vector2.zero;
            var titleBg = title.gameObject.AddComponent<Outline>();
            titleBg.effectColor = new Color(0.55f, 0f, 0.15f, 1f);
            titleBg.effectDistance = new Vector2(2, -2);

            StyleTargetText("CherryBG", "🍒");
            StyleTargetText("DiamondBG", "◆");
            StyleTargetText("StarBG", "★");
        }

        void StyleTargetText(string bgName, string symbol)
        {
            var box = FindByName(bgName);
            if (box == null) return;

            var img = box.GetComponent<Image>();
            if (img != null) img.color = new Color(1f, 1f, 1f, 0f);

            var text = box.GetComponentInChildren<Text>(true);
            if (text == null) return;

            text.color = Color.black;
            text.fontStyle = FontStyle.Bold;
            text.resizeTextForBestFit = true;
            text.resizeTextMaxSize = 30;

            var label = MakeText(box.transform, symbol, 24, bgName == "StarBG" ? Gold : Pink);
            label.rectTransform.anchorMin = new Vector2(-0.7f, 0f);
            label.rectTransform.anchorMax = new Vector2(0f, 1f);
            label.rectTransform.offsetMin = label.rectTransform.offsetMax = Vector2.zero;
        }

        void StyleExistingButton(string buttonName, Color inner, string label, int fontSize)
        {
            var go = FindByName(buttonName);
            if (go == null) return;
            if (go.transform.Find("FunctionalVisual") != null) return;

            var buttonImage = go.GetComponent<Image>();
            if (buttonImage != null) buttonImage.color = new Color(1, 1, 1, 0.001f);

            var visual = NewRect("FunctionalVisual", go.transform);
            Stretch(visual);
            var border = visual.gameObject.AddComponent<Image>();
            border.color = Gold;
            border.raycastTarget = false;

            var inside = NewRect("Inner", visual);
            inside.anchorMin = Vector2.zero;
            inside.anchorMax = Vector2.one;
            inside.offsetMin = new Vector2(5, 5);
            inside.offsetMax = new Vector2(-5, -5);
            var insideImage = inside.gameObject.AddComponent<Image>();
            insideImage.color = inner;
            insideImage.raycastTarget = false;

            var text = MakeText(inside, label, fontSize, Color.white);
            Stretch(text.rectTransform);
            var outline = text.gameObject.AddComponent<Outline>();
            outline.effectColor = new Color(0, 0, 0, 0.9f);
            outline.effectDistance = new Vector2(2, -2);
        }

        void StyleBooster(string name, Color inner, string label)
        {
            StyleExistingButton(name, inner, label, 20);
        }

        IEnumerator UpdateHomeStats()
        {
            var coinField = typeof(WamBamGame).GetField("coins", BindingFlags.Instance | BindingFlags.NonPublic);
            var livesField = typeof(WamBamGame).GetField("lives", BindingFlags.Instance | BindingFlags.NonPublic);

            for (;;)
            {
                var homeCoins = FindByName("FunctionalHomeCoinsText")?.GetComponent<Text>();
                if (homeCoins != null && coinField != null)
                {
                    int coins = (int)coinField.GetValue(game);
                    homeCoins.text = "●  " + coins.ToString("N0") + "   +";
                }

                var homeLives = FindByName("HomeLives");
                if (homeLives != null && livesField != null)
                {
                    var text = homeLives.GetComponentInChildren<Text>(true);
                    if (text != null)
                    {
                        int lives = (int)livesField.GetValue(game);
                        text.text = "♥  " + lives + "  FULL";
                    }
                }

                yield return new WaitForSecondsRealtime(0.25f);
            }
        }

        static GameObject FindByName(string name)
        {
            var transforms = FindObjectsByType<Transform>(FindObjectsInactive.Include, FindObjectsSortMode.None);
            foreach (var t in transforms)
                if (t != null && t.gameObject.name == name)
                    return t.gameObject;
            return null;
        }

        static RectTransform NewRect(string name, Transform parent)
        {
            var go = new GameObject(name, typeof(RectTransform));
            go.transform.SetParent(parent, false);
            return go.GetComponent<RectTransform>();
        }

        static Text MakeText(Transform parent, string value, int fontSize, Color color)
        {
            var go = new GameObject("Label", typeof(RectTransform), typeof(CanvasRenderer), typeof(Text));
            go.transform.SetParent(parent, false);
            var text = go.GetComponent<Text>();
            text.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            text.text = value;
            text.fontSize = fontSize;
            text.fontStyle = FontStyle.Bold;
            text.alignment = TextAnchor.MiddleCenter;
            text.color = color;
            text.resizeTextForBestFit = true;
            text.resizeTextMinSize = 10;
            text.resizeTextMaxSize = fontSize;
            text.raycastTarget = false;
            return text;
        }

        static RectTransform CreatePanel(Transform parent, string name, float x, float y, float w, float h, Color inner, Color border, int borderSize)
        {
            var outer = NewRect(name, parent);
            RefRect(outer, x, y, w, h);
            outer.gameObject.AddComponent<Image>().color = border;

            var inside = NewRect("Inner", outer);
            inside.anchorMin = Vector2.zero;
            inside.anchorMax = Vector2.one;
            inside.offsetMin = new Vector2(borderSize, borderSize);
            inside.offsetMax = new Vector2(-borderSize, -borderSize);
            inside.gameObject.AddComponent<Image>().color = inner;
            return outer;
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
    }
}
