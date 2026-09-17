using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace WamBamThankUMam
{
    [DefaultExecutionOrder(25000)]
    public sealed class Alpha06PhotoUI : MonoBehaviour
    {
        Sprite backgroundSprite;
        bool applied;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void Install()
        {
            if (FindFirstObjectByType<Alpha06PhotoUI>() != null) return;
            var go = new GameObject("Alpha 0.6 Photo UI");
            DontDestroyOnLoad(go);
            go.AddComponent<Alpha06PhotoUI>();
        }

        void Awake()
        {
            backgroundSprite = LoadBackground();
        }

        void LateUpdate()
        {
            if (applied || backgroundSprite == null) return;

            var gameScreen = FindObject("Game Screen");
            if (gameScreen == null) return;

            var reference = FindObject("Reference Artwork");
            if (reference != null)
            {
                var img = reference.GetComponent<Image>();
                if (img != null)
                {
                    img.enabled = true;
                    img.sprite = backgroundSprite;
                    img.color = Color.white;
                    img.preserveAspect = false;
                    var r = img.rectTransform;
                    r.anchorMin = Vector2.zero;
                    r.anchorMax = Vector2.one;
                    r.offsetMin = Vector2.zero;
                    r.offsetMax = Vector2.zero;
                }
            }

            MakeTransparent("Moves BG");
            MakeTransparent("Coins BG");
            MakeTransparent("Lives BG");
            MakeTransparent("Cherry Goal BG");
            MakeTransparent("Diamond Goal BG");
            MakeTransparent("Star Goal BG");
            MakeTransparent("Rocket Count BG");
            MakeTransparent("Hammer Count BG");
            MakeTransparent("Disco Count BG");
            MakeTransparent("Swap Count BG");

            BringToFront("Live Board Cover");
            BringToFront("Live Match Board");
            BringToFront("Moves BG");
            BringToFront("Coins BG");
            BringToFront("Lives BG");
            BringToFront("Cherry Goal BG");
            BringToFront("Diamond Goal BG");
            BringToFront("Star Goal BG");
            BringToFront("Rocket");
            BringToFront("Rocket Count BG");
            BringToFront("Hammer");
            BringToFront("Hammer Count BG");
            BringToFront("Disco");
            BringToFront("Disco Count BG");
            BringToFront("Swap");
            BringToFront("Swap Count BG");
            BringToFront("Pause");

            applied = true;
        }

        Sprite LoadBackground()
        {
            var tex = Resources.Load<Texture2D>("Alpha06/game_ui_background");
            if (tex != null)
                return Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height), new Vector2(.5f, .5f), 100f);

            TextAsset[] chunks = Resources.LoadAll<TextAsset>("Encoded/Alpha06Background");
            Array.Sort(chunks, (a,b) => string.CompareOrdinal(a.name, b.name));
            if (chunks.Length == 0) return null;

            var sb = new StringBuilder();
            foreach (var c in chunks) sb.Append(c.text.Trim());

            try
            {
                byte[] data = Convert.FromBase64String(sb.ToString());
                var decoded = new Texture2D(2, 2, TextureFormat.RGBA32, false);
                if (!decoded.LoadImage(data, false)) return null;
                decoded.filterMode = FilterMode.Bilinear;
                decoded.wrapMode = TextureWrapMode.Clamp;
                return Sprite.Create(decoded, new Rect(0, 0, decoded.width, decoded.height), new Vector2(.5f, .5f), 100f);
            }
            catch (Exception e)
            {
                Debug.LogError("Alpha 0.6 UI background failed to decode: " + e.Message);
                return null;
            }
        }

        static void MakeTransparent(string name)
        {
            var go = FindObject(name);
            if (go == null) return;

            var img = go.GetComponent<Image>();
            if (img != null)
            {
                img.color = new Color(1f, 1f, 1f, 0f);
                img.raycastTarget = false;
            }

            var text = go.GetComponentInChildren<Text>(true);
            if (text != null)
            {
                text.transform.SetAsLastSibling();
                text.fontStyle = FontStyle.Bold;
                text.raycastTarget = false;

                bool darkText = name.Contains("Goal");
                text.color = darkText ? Color.black : Color.white;

                var outline = text.GetComponent<Outline>();
                if (!darkText)
                {
                    if (outline == null) outline = text.gameObject.AddComponent<Outline>();
                    outline.enabled = true;
                    outline.effectColor = new Color(0f,0f,0f,.9f);
                    outline.effectDistance = new Vector2(2f,-2f);
                }
                else if (outline != null)
                {
                    outline.enabled = false;
                }
            }
        }

        static void BringToFront(string name)
        {
            var go = FindObject(name);
            if (go != null) go.transform.SetAsLastSibling();
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
