using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace WamBamThankUMam
{
    [DefaultExecutionOrder(1000)]
    public sealed class HudBlendFix : MonoBehaviour
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void Install()
        {
            if (FindFirstObjectByType<HudBlendFix>() != null) return;
            var go = new GameObject("WamBam HUD Blend Fix");
            DontDestroyOnLoad(go);
            go.AddComponent<HudBlendFix>();
        }

        IEnumerator Start()
        {
            for (;;)
            {
                Apply();
                yield return new WaitForSecondsRealtime(0.25f);
            }
        }

        void Apply()
        {
            StyleHud("MovesBG",  new Color(0.58f, 0.015f, 0.19f, 0.97f), Color.white, 2f);
            StyleHud("CoinsBG",  new Color(0.055f, 0.045f, 0.055f, 0.90f), Color.white, 1.5f);
            StyleHud("LivesBG",  new Color(0.80f, 0.025f, 0.25f, 0.94f), Color.white, 1.5f);

            StyleHud("CherryBG",  new Color(0.95f, 0.89f, 0.78f, 0.94f), Color.black, 0f);
            StyleHud("DiamondBG", new Color(0.95f, 0.89f, 0.78f, 0.94f), Color.black, 0f);
            StyleHud("StarBG",    new Color(0.95f, 0.89f, 0.78f, 0.94f), Color.black, 0f);
        }

        static void StyleHud(string objectName, Color background, Color textColor, float outlineSize)
        {
            var go = GameObject.Find(objectName);
            if (go == null) return;

            var image = go.GetComponent<Image>();
            if (image != null)
            {
                image.color = background;
                image.raycastTarget = false;
            }

            var text = go.GetComponentInChildren<Text>();
            if (text == null) return;

            text.color = textColor;
            text.fontStyle = FontStyle.Bold;

            var outline = text.GetComponent<Outline>();
            if (outlineSize > 0f)
            {
                if (outline == null) outline = text.gameObject.AddComponent<Outline>();
                outline.effectColor = new Color(0f, 0f, 0f, 0.85f);
                outline.effectDistance = new Vector2(outlineSize, -outlineSize);
                outline.useGraphicAlpha = true;
            }
            else if (outline != null)
            {
                outline.enabled = false;
            }
        }
    }
}
