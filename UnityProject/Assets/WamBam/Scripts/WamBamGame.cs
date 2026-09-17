using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace WamBamThankUMam
{
    public enum PieceKind { Heart, Lipstick, Cherries, Diamond, Star, Heel }

    public sealed class WamBamGame : MonoBehaviour
    {
        const int W = 8, H = 8, StartMoves = 16;
        readonly PieceKind[,] board = new PieceKind[W,H];
        readonly System.Random rng = new System.Random();
        readonly Sprite[] pieceSprites = new Sprite[6];

        Canvas canvas;
        Font font;
        GameObject homeScreen, gameScreen, modal;
        RectTransform boardRoot;
        GridLayoutGroup grid;
        Text movesText, cherryText, diamondText, starText, coinText, lifeText, modalTitle, modalBody;
        readonly Text[] boosterText = new Text[4];
        Sprite menuSprite, gameSprite;
        bool busy;
        TileView selected, boosterFirst;
        Booster booster = Booster.None;
        int moves = StartMoves, cherries = 30, diamonds = 18, stars = 20, coins = 12450, lives = 5;
        readonly int[] boosterCounts = {3,3,3,3};

        enum Booster { None, Rocket, Hammer, Disco, Swap }
        public bool CanUseBoard => !busy && gameScreen != null && gameScreen.activeSelf && (modal == null || !modal.activeSelf);

        void Awake()
        {
            Application.targetFrameRate = 60;
            Screen.sleepTimeout = SleepTimeout.NeverSleep;
            font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            LoadArtwork();
            BuildUI();
            ShowHome();
        }

        void LoadArtwork()
        {
            Texture2D menu = DecodeTexture("Encoded/Menu");
            Texture2D game = DecodeTexture("Encoded/Game");
            menuSprite = FullSprite(menu);
            gameSprite = FullSprite(game);

            pieceSprites[(int)PieceKind.Heart] = CropPiece(game,160,626,78);
            pieceSprites[(int)PieceKind.Lipstick] = CropPiece(game,242,625,78);
            pieceSprites[(int)PieceKind.Cherries] = CropPiece(game,322,624,78);
            pieceSprites[(int)PieceKind.Diamond] = CropPiece(game,401,625,78);
            pieceSprites[(int)PieceKind.Star] = CropPiece(game,482,624,78);
            pieceSprites[(int)PieceKind.Heel] = CropPiece(game,324,715,78);
        }

        Texture2D DecodeTexture(string folder)
        {
            TextAsset[] chunks = Resources.LoadAll<TextAsset>(folder);
            Array.Sort(chunks,(a,b)=>string.CompareOrdinal(a.name,b.name));
            if (chunks.Length == 0) return Fallback();
            var sb = new StringBuilder();
            foreach (var c in chunks) sb.Append(c.text.Trim());
            try
            {
                byte[] data = Convert.FromBase64String(sb.ToString());
                var tex = new Texture2D(2,2,TextureFormat.RGBA32,false);
                if (tex.LoadImage(data,false)) { tex.filterMode=FilterMode.Bilinear; tex.wrapMode=TextureWrapMode.Clamp; return tex; }
            }
            catch(Exception e) { Debug.LogError(e); }
            return Fallback();
        }

        Texture2D Fallback()
        {
            var t = new Texture2D(2,2); t.SetPixels(new[]{Color.magenta,Color.black,Color.black,Color.magenta}); t.Apply(); return t;
        }

        Sprite FullSprite(Texture2D t) => Sprite.Create(t,new Rect(0,0,t.width,t.height),new Vector2(.5f,.5f),100f);

        Sprite CropPiece(Texture2D src,int cx,int cyTop,int size)
        {
            int x=Mathf.Clamp(cx-size/2,0,src.width-size);
            int y=Mathf.Clamp(src.height-cyTop-size/2,0,src.height-size);
            Color[] px=src.GetPixels(x,y,size,size);
            bool[] seen=new bool[px.Length];
            var q=new Queue<int>();
            for(int i=0;i<size;i++){q.Enqueue(i);q.Enqueue((size-1)*size+i);q.Enqueue(i*size);q.Enqueue(i*size+size-1);}            
            while(q.Count>0)
            {
                int n=q.Dequeue(); if(n<0||n>=px.Length||seen[n]) continue; seen[n]=true;
                Color c=px[n]; float mx=Mathf.Max(c.r,Mathf.Max(c.g,c.b)), mn=Mathf.Min(c.r,Mathf.Min(c.g,c.b));
                if(mx>.30f || mx-mn>.18f) continue;
                px[n].a=0f; int xx=n%size, yy=n/size;
                if(xx>0)q.Enqueue(n-1); if(xx<size-1)q.Enqueue(n+1); if(yy>0)q.Enqueue(n-size); if(yy<size-1)q.Enqueue(n+size);
            }
            var t=new Texture2D(size,size,TextureFormat.RGBA32,false); t.SetPixels(px); t.Apply(); t.filterMode=FilterMode.Bilinear;
            return Sprite.Create(t,new Rect(0,0,size,size),new Vector2(.5f,.5f),size);
        }

        void BuildUI()
        {
            if (FindFirstObjectByType<EventSystem>() == null)
            {
                var es=new GameObject("EventSystem",typeof(EventSystem),typeof(StandaloneInputModule)); es.transform.SetParent(transform,false);
            }
            var cgo=new GameObject("Canvas",typeof(Canvas),typeof(CanvasScaler),typeof(GraphicRaycaster)); cgo.transform.SetParent(transform,false);
            canvas=cgo.GetComponent<Canvas>(); canvas.renderMode=RenderMode.ScreenSpaceOverlay;
            var scaler=cgo.GetComponent<CanvasScaler>(); scaler.uiScaleMode=CanvasScaler.ScaleMode.ScaleWithScreenSize; scaler.referenceResolution=new Vector2(864,1536); scaler.screenMatchMode=CanvasScaler.ScreenMatchMode.MatchWidthOrHeight; scaler.matchWidthOrHeight=.5f;
            homeScreen=Panel("Home",canvas.transform); gameScreen=Panel("Game",canvas.transform);
            BuildHome(); BuildGame(); BuildModal();
        }

        GameObject Panel(string n,Transform p)
        {
            var g=new GameObject(n,typeof(RectTransform)); g.transform.SetParent(p,false); var r=g.GetComponent<RectTransform>(); r.anchorMin=Vector2.zero;r.anchorMax=Vector2.one;r.offsetMin=r.offsetMax=Vector2.zero;return g;
        }

        Image ImageGO(string n,Transform p,Sprite s,Color c,bool ray=false)
        {
            var g=new GameObject(n,typeof(RectTransform),typeof(CanvasRenderer),typeof(Image));g.transform.SetParent(p,false);var i=g.GetComponent<Image>();i.sprite=s;i.color=c;i.raycastTarget=ray;return i;
        }

        Text TextGO(string n,Transform p,string value,int size,Color c)
        {
            var g=new GameObject(n,typeof(RectTransform),typeof(CanvasRenderer),typeof(Text));g.transform.SetParent(p,false);var t=g.GetComponent<Text>();t.font=font;t.text=value;t.fontSize=size;t.fontStyle=FontStyle.Bold;t.color=c;t.alignment=TextAnchor.MiddleCenter;t.resizeTextForBestFit=true;t.resizeTextMinSize=10;t.resizeTextMaxSize=size;t.raycastTarget=false;return t;
        }

        void Stretch(RectTransform r){r.anchorMin=Vector2.zero;r.anchorMax=Vector2.one;r.offsetMin=r.offsetMax=Vector2.zero;}
        void RefRect(RectTransform r,float x,float y,float w,float h,float rw,float rh){r.anchorMin=new Vector2(x/rw,1-(y+h)/rh);r.anchorMax=new Vector2((x+w)/rw,1-y/rh);r.offsetMin=r.offsetMax=Vector2.zero;}

        void BuildHome()
        {
            var black=ImageGO("Black",homeScreen.transform,null,Color.black);Stretch(black.rectTransform);
            var art=ImageGO("Exact Menu Artwork",homeScreen.transform,menuSprite,Color.white);
            art.preserveAspect=true; Stretch(art.rectTransform);
            var fit=art.gameObject.AddComponent<AspectRatioFitter>(); fit.aspectMode=AspectRatioFitter.AspectMode.FitInParent; fit.aspectRatio=709f/1536f;

            AddHit(art.transform,"PLAY",158,1018,398,130,709,1536,StartLevel);
            AddHit(art.transform,"EVENTS",8,1138,162,148,709,1536,()=>Info("EVENTS","Timed events will be added after the first level pack."));
            AddHit(art.transform,"SHOP",173,1138,176,148,709,1536,()=>Info("SHOP","Coins and booster packs will live here."));
            AddHit(art.transform,"CHALLENGES",352,1138,180,148,709,1536,()=>Info("CHALLENGES","Clear all three targets before your moves run out."));
            AddHit(art.transform,"SETTINGS",536,1138,165,148,709,1536,()=>Info("SETTINGS","Sound, vibration and graphics settings are coming next."));
            AddHit(art.transform,"VIP",571,160,125,82,709,1536,()=>Info("VIP","VIP rewards will be added later."));
        }

        void BuildGame()
        {
            var art=ImageGO("Exact Gameplay Artwork",gameScreen.transform,gameSprite,Color.white); art.preserveAspect=false;Stretch(art.rectTransform);
            var cover=ImageGO("Live Board Cover",gameScreen.transform,null,new Color(.025f,.027f,.035f,.99f));RefRect(cover.rectTransform,108,573,660,735,864,1536);
            var br=new GameObject("Live Board",typeof(RectTransform),typeof(GridLayoutGroup));br.transform.SetParent(gameScreen.transform,false);boardRoot=br.GetComponent<RectTransform>();RefRect(boardRoot,114,580,648,720,864,1536);
            grid=br.GetComponent<GridLayoutGroup>();grid.constraint=GridLayoutGroup.Constraint.FixedColumnCount;grid.constraintCount=8;grid.spacing=new Vector2(2.5f,2.5f);grid.padding=new RectOffset(2,2,2,2);grid.childAlignment=TextAnchor.MiddleCenter;

            movesText=Value(gameScreen.transform,"Moves","16",91,102,105,74,46,Color.white,new Color(.06f,.05f,.06f,.98f));
            coinText=Value(gameScreen.transform,"Coins","12,450",669,52,135,48,28,Color.white,new Color(.06f,.05f,.06f,.98f));
            lifeText=Value(gameScreen.transform,"Lives","5",770,143,58,55,38,Color.white,new Color(.91f,.03f,.30f,.98f));
            cherryText=Value(gameScreen.transform,"Cherry","30",132,386,66,47,28,Color.black,new Color(.95f,.89f,.78f,.98f));
            diamondText=Value(gameScreen.transform,"Diamond","18",132,452,66,47,28,Color.black,new Color(.95f,.89f,.78f,.98f));
            starText=Value(gameScreen.transform,"Star","20",132,514,66,47,28,Color.black,new Color(.95f,.89f,.78f,.98f));

            AddBooster(0,Booster.Rocket,42,1316,171,176); AddBooster(1,Booster.Hammer,220,1316,171,176); AddBooster(2,Booster.Disco,401,1316,171,176); AddBooster(3,Booster.Swap,579,1316,171,176);
            AddHit(gameScreen.transform,"Pause",761,1403,97,118,864,1536,ShowHome);
        }

        Text Value(Transform p,string n,string v,float x,float y,float w,float h,int fs,Color tc,Color bg)
        {
            var i=ImageGO(n+"BG",p,null,bg);RefRect(i.rectTransform,x,y,w,h,864,1536);var t=TextGO(n,i.transform,v,fs,tc);Stretch(t.rectTransform);return t;
        }

        void AddBooster(int index,Booster b,float x,float y,float w,float h)
        {
            AddHit(gameScreen.transform,b.ToString(),x,y,w,h,864,1536,()=>SelectBooster(b));
            boosterText[index]=Value(gameScreen.transform,b+"Count","3",x+w-50,y+8,40,40,24,Color.white,new Color(.93f,.03f,.34f,.98f));
        }

        void AddHit(Transform p,string n,float x,float y,float w,float h,float rw,float rh,Action action)
        {
            var g=new GameObject(n,typeof(RectTransform),typeof(CanvasRenderer),typeof(Image),typeof(Button));g.transform.SetParent(p,false);var img=g.GetComponent<Image>();img.color=new Color(1,1,1,.001f);RefRect(g.GetComponent<RectTransform>(),x,y,w,h,rw,rh);var b=g.GetComponent<Button>();b.transition=Selectable.Transition.None;b.onClick.AddListener(()=>action());
        }

        void BuildModal()
        {
            modal=Panel("Modal",canvas.transform);var dim=ImageGO("Dim",modal.transform,null,new Color(0,0,0,.72f));Stretch(dim.rectTransform);
            var box=ImageGO("Box",modal.transform,null,new Color(.06f,.03f,.08f,.98f));box.rectTransform.anchorMin=new Vector2(.12f,.34f);box.rectTransform.anchorMax=new Vector2(.88f,.68f);box.rectTransform.offsetMin=box.rectTransform.offsetMax=Vector2.zero;
            modalTitle=TextGO("Title",box.transform,"WAM BAM",42,Color.white);modalTitle.rectTransform.anchorMin=new Vector2(.05f,.67f);modalTitle.rectTransform.anchorMax=new Vector2(.95f,.92f);modalTitle.rectTransform.offsetMin=modalTitle.rectTransform.offsetMax=Vector2.zero;
            modalBody=TextGO("Body",box.transform,"",25,Color.white);modalBody.rectTransform.anchorMin=new Vector2(.08f,.26f);modalBody.rectTransform.anchorMax=new Vector2(.92f,.67f);modalBody.rectTransform.offsetMin=modalBody.rectTransform.offsetMax=Vector2.zero;
            var close=new GameObject("Close",typeof(RectTransform),typeof(CanvasRenderer),typeof(Image),typeof(Button));close.transform.SetParent(box.transform,false);var cr=close.GetComponent<RectTransform>();cr.anchorMin=new Vector2(.22f,.06f);cr.anchorMax=new Vector2(.78f,.24f);cr.offsetMin=cr.offsetMax=Vector2.zero;close.GetComponent<Image>().color=new Color(.91f,.03f,.30f,1);close.GetComponent<Button>().onClick.AddListener(()=>modal.SetActive(false));var ct=TextGO("Label",close.transform,"CLOSE",28,Color.white);Stretch(ct.rectTransform);modal.SetActive(false);
        }

        void Info(string title,string body){modalTitle.text=title;modalBody.text=body;modal.SetActive(true);}
        void ShowHome(){busy=false;booster=Booster.None;selected=null;homeScreen.SetActive(true);gameScreen.SetActive(false);modal.SetActive(false);}

        void StartLevel()
        {
            homeScreen.SetActive(false);gameScreen.SetActive(true);modal.SetActive(false);moves=16;cherries=30;diamonds=18;stars=20;selected=null;booster=Booster.None;boosterFirst=null;Generate();Rebuild();UpdateHud();
        }

        public void HandleTileGesture(TileView tile,Vector2 delta)
        {
            if(!CanUseBoard||tile==null)return;
            if(booster!=Booster.None){BoosterTap(tile);return;}
            if(delta.magnitude<24f){Tap(tile);return;}
            int dx=0,dy=0;if(Mathf.Abs(delta.x)>Mathf.Abs(delta.y))dx=delta.x>0?1:-1;else dy=delta.y>0?1:-1;TrySwap(tile.X,tile.Y,tile.X+dx,tile.Y+dy,true);
        }

        void Tap(TileView t)
        {
            if(selected==null){selected=t;return;}int d=Mathf.Abs(selected.X-t.X)+Mathf.Abs(selected.Y-t.Y);if(d==1){var a=selected;selected=null;TrySwap(a.X,a.Y,t.X,t.Y,true);}else selected=t;
        }

        void SelectBooster(Booster b)
        {
            int i=(int)b-1;if(i<0||boosterCounts[i]<=0)return;booster=b;selected=null;boosterFirst=null;string s=b==Booster.Rocket?"Tap a tile to clear its row and column.":b==Booster.Hammer?"Tap a tile to remove it.":b==Booster.Disco?"Tap a tile to clear every matching symbol.":"Tap two neighbouring tiles for a free swap.";Info(b.ToString().ToUpper(),s);
        }

        void BoosterTap(TileView t)
        {
            modal.SetActive(false);
            if(booster==Booster.Swap)
            {
                if(boosterFirst==null){boosterFirst=t;return;}int d=Mathf.Abs(boosterFirst.X-t.X)+Mathf.Abs(boosterFirst.Y-t.Y);if(d!=1){boosterFirst=t;return;}Consume(Booster.Swap);var a=boosterFirst;boosterFirst=null;booster=Booster.None;StartCoroutine(FreeSwap(a.X,a.Y,t.X,t.Y));return;
            }
            var clear=new HashSet<Vector2Int>();
            if(booster==Booster.Hammer)clear.Add(new Vector2Int(t.X,t.Y));
            else if(booster==Booster.Rocket){for(int x=0;x<W;x++)clear.Add(new Vector2Int(x,t.Y));for(int y=0;y<H;y++)clear.Add(new Vector2Int(t.X,y));}
            else if(booster==Booster.Disco){PieceKind k=board[t.X,t.Y];for(int y=0;y<H;y++)for(int x=0;x<W;x++)if(board[x,y]==k)clear.Add(new Vector2Int(x,y));}
            Booster used=booster;booster=Booster.None;Consume(used);StartCoroutine(Clear(clear));
        }

        void Consume(Booster b){int i=(int)b-1;if(i>=0){boosterCounts[i]=Mathf.Max(0,boosterCounts[i]-1);UpdateHud();}}

        IEnumerator FreeSwap(int x1,int y1,int x2,int y2){busy=true;Swap(x1,y1,x2,y2);Rebuild();yield return new WaitForSecondsRealtime(.12f);var m=Matches();if(m.Count>0)yield return Resolve(m);busy=false;CheckEnd();}
        void TrySwap(int x1,int y1,int x2,int y2,bool spend){if(busy||x2<0||x2>=W||y2<0||y2>=H)return;StartCoroutine(SwapRoutine(x1,y1,x2,y2,spend));}
        IEnumerator SwapRoutine(int x1,int y1,int x2,int y2,bool spend){busy=true;Swap(x1,y1,x2,y2);Rebuild();yield return new WaitForSecondsRealtime(.12f);var m=Matches();if(m.Count==0){Swap(x1,y1,x2,y2);Rebuild();busy=false;yield break;}if(spend)moves=Mathf.Max(0,moves-1);UpdateHud();yield return Resolve(m);busy=false;CheckEnd();}
        IEnumerator Clear(HashSet<Vector2Int> set){busy=true;CountGoals(set);foreach(var p in set)board[p.x,p.y]=(PieceKind)(-1);Collapse();Rebuild();UpdateHud();yield return new WaitForSecondsRealtime(.12f);var m=Matches();if(m.Count>0)yield return Resolve(m);busy=false;CheckEnd();}
        IEnumerator Resolve(HashSet<Vector2Int> m){while(m.Count>0){CountGoals(m);foreach(var p in m)board[p.x,p.y]=(PieceKind)(-1);Collapse();Rebuild();UpdateHud();yield return new WaitForSecondsRealtime(.12f);m=Matches();}}

        void CountGoals(IEnumerable<Vector2Int> set){foreach(var p in set){var k=board[p.x,p.y];if(k==PieceKind.Cherries&&cherries>0)cherries--;else if(k==PieceKind.Diamond&&diamonds>0)diamonds--;else if(k==PieceKind.Star&&stars>0)stars--;}}
        void CheckEnd(){if(cherries<=0&&diamonds<=0&&stars<=0){coins+=250;UpdateHud();Info("WAM! YOU WON","Level complete. +250 coins.");}else if(moves<=0){lives=Mathf.Max(0,lives-1);UpdateHud();Info("OUT OF MOVES","Try the level again.");}}

        void Generate(){for(int y=0;y<H;y++)for(int x=0;x<W;x++){var o=new List<PieceKind>{PieceKind.Heart,PieceKind.Lipstick,PieceKind.Cherries,PieceKind.Diamond,PieceKind.Star,PieceKind.Heel};if(x>=2&&board[x-1,y]==board[x-2,y])o.Remove(board[x-1,y]);if(y>=2&&board[x,y-1]==board[x,y-2])o.Remove(board[x,y-1]);board[x,y]=o[rng.Next(o.Count)];}}
        void Swap(int x1,int y1,int x2,int y2){var t=board[x1,y1];board[x1,y1]=board[x2,y2];board[x2,y2]=t;}

        HashSet<Vector2Int> Matches()
        {
            var m=new HashSet<Vector2Int>();
            for(int y=0;y<H;y++){int s=0;while(s<W){PieceKind k=board[s,y];int e=s+1;while(e<W&&board[e,y]==k)e++;if((int)k>=0&&e-s>=3)for(int x=s;x<e;x++)m.Add(new Vector2Int(x,y));s=e;}}
            for(int x=0;x<W;x++){int s=0;while(s<H){PieceKind k=board[x,s];int e=s+1;while(e<H&&board[x,e]==k)e++;if((int)k>=0&&e-s>=3)for(int y=s;y<e;y++)m.Add(new Vector2Int(x,y));s=e;}}
            return m;
        }

        void Collapse(){for(int x=0;x<W;x++){int w=H-1;for(int r=H-1;r>=0;r--)if((int)board[x,r]>=0)board[x,w--]=board[x,r];while(w>=0)board[x,w--]=(PieceKind)rng.Next(0,6);}}

        void Rebuild()
        {
            var old=new List<Transform>();foreach(Transform c in boardRoot)old.Add(c);foreach(var c in old){c.SetParent(null,false);Destroy(c.gameObject);}Canvas.ForceUpdateCanvases();float bw=boardRoot.rect.width,bh=boardRoot.rect.height;grid.cellSize=new Vector2((bw-grid.spacing.x*7-4)/8f,(bh-grid.spacing.y*7-4)/8f);
            for(int y=0;y<H;y++)for(int x=0;x<W;x++){var g=new GameObject($"Tile {x},{y}",typeof(RectTransform),typeof(CanvasRenderer),typeof(Image),typeof(TileView));g.transform.SetParent(boardRoot,false);g.GetComponent<Image>().raycastTarget=true;var t=g.GetComponent<TileView>();var k=board[x,y];t.Setup(this,x,y,k,pieceSprites[(int)k]);}
        }

        void UpdateHud(){if(movesText==null)return;movesText.text=moves.ToString();cherryText.text=Mathf.Max(0,cherries).ToString();diamondText.text=Mathf.Max(0,diamonds).ToString();starText.text=Mathf.Max(0,stars).ToString();coinText.text=coins.ToString("N0");lifeText.text=lives.ToString();for(int i=0;i<4;i++)if(boosterText[i]!=null)boosterText[i].text=boosterCounts[i].ToString();}
    }
}
