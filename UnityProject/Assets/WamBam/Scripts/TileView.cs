using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace WamBamThankUMam
{
    public sealed class TileView : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
    {
        public int X { get; private set; }
        public int Y { get; private set; }
        public PieceKind Kind { get; private set; }

        private WamBamGame game;
        private Image image;
        private Vector2 pointerDown;
        private float phase;

        public void Setup(WamBamGame owner, int x, int y, PieceKind kind, Sprite sprite)
        {
            game = owner;
            image = GetComponent<Image>();
            SetPiece(x, y, kind, sprite);
            phase = Random.Range(0f, 6.28f);
        }

        public void SetPiece(int x, int y, PieceKind kind, Sprite sprite)
        {
            X = x;
            Y = y;
            Kind = kind;
            if (image != null)
            {
                image.sprite = sprite;
                image.preserveAspect = true;
                image.color = Color.white;
            }
        }

        public void OnPointerDown(PointerEventData eventData)
        {
            if (!game.CanUseBoard) return;
            pointerDown = eventData.position;
        }

        public void OnPointerUp(PointerEventData eventData)
        {
            if (!game.CanUseBoard) return;
            game.HandleTileGesture(this, eventData.position - pointerDown);
        }

        private void Update()
        {
            if (image == null) return;

            float t = Time.unscaledTime * 2f + phase;
            float scale = 1f;
            float rotation = 0f;
            float y = 0f;

            switch (Kind)
            {
                case PieceKind.Heart:
                    scale = 1f + Mathf.Sin(t * 1.25f) * 0.055f;
                    break;
                case PieceKind.Lipstick:
                    y = Mathf.Sin(t * 1.10f) * 4f;
                    rotation = Mathf.Sin(t * 0.75f) * 2.5f;
                    break;
                case PieceKind.Cherries:
                    rotation = Mathf.Sin(t * 0.75f) * 4f;
                    break;
                case PieceKind.Diamond:
                    scale = 1f + Mathf.Sin(t * 1.65f) * 0.035f;
                    break;
                case PieceKind.Star:
                    rotation = Mathf.Sin(t * 0.65f) * 5f;
                    scale = 1f + Mathf.Sin(t * 1.4f) * 0.04f;
                    break;
                case PieceKind.Heel:
                    rotation = Mathf.Sin(t * 0.8f) * 3.5f;
                    break;
            }

            image.rectTransform.localScale = Vector3.one * scale;
            image.rectTransform.localRotation = Quaternion.Euler(0f, 0f, rotation);
            image.rectTransform.anchoredPosition = new Vector2(0f, y);
        }
    }
}
