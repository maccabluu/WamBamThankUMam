package com.blustudio.wambam;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.graphics.Shader;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.os.Build;
import android.os.SystemClock;
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

public class ComicGameModeView extends View {
    private static final int HOME=0, GAME=1, COLS=8, ROWS=8, START_MOVES=16;
    private static final int HEART=0, LIPSTICK=1, CHERRIES=2, DIAMOND=3, STAR=4, HEEL=5;
    private static final int START_CHERRIES=30, START_DIAMONDS=18, START_STARS=20;

    private final Paint paint=new Paint(Paint.ANTI_ALIAS_FLAG|Paint.FILTER_BITMAP_FLAG);
    private final Paint text=new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Random random=new Random();
    private final int[][] board=new int[COLS][ROWS];
    private final ToneGenerator tones=new ToneGenerator(AudioManager.STREAM_MUSIC,28);
    private final long animationStart=SystemClock.uptimeMillis();

    private Bitmap homeBackground;
    private int screen=HOME, movesLeft=START_MOVES, cherriesLeft=START_CHERRIES, diamondsLeft=START_DIAMONDS, starsLeft=START_STARS;
    private int coins=12450, lives=5;
    private float downX, downY;
    private int downCellX=-1, downCellY=-1, selectedX=-1, selectedY=-1;
    private final int[] boosterCounts={3,3,3,3};
    private int boosterMode=-1;
    private String toast="";
    private long toastUntil;
    private boolean modal;
    private String modalTitle="", modalBody="", modalButton="OK";
    private Runnable modalAction;

    public ComicGameModeView(Context context){
        super(context);
        setKeepScreenOn(true);
        setFocusable(true);
        homeBackground=readRawBitmap(R.raw.home_bg);
        generateBoard();
    }

    private Bitmap readRawBitmap(int id){
        try(InputStream in=getResources().openRawResource(id); ByteArrayOutputStream out=new ByteArrayOutputStream()){
            byte[] buffer=new byte[4096]; int read;
            while((read=in.read(buffer))!=-1) out.write(buffer,0,read);
            byte[] bytes=Base64.decode(new String(out.toByteArray(), StandardCharsets.UTF_8).trim(),Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(bytes,0,bytes.length);
        }catch(Exception ignored){ return null; }
    }

    @Override protected void onDraw(Canvas canvas){
        super.onDraw(canvas);
        if(screen==HOME) drawHome(canvas); else drawGame(canvas);
        if(modal) drawModal(canvas);
        if(!toast.isEmpty() && System.currentTimeMillis()<toastUntil) drawToast(canvas); else if(!toast.isEmpty()) toast="";
        if(screen==GAME && !modal) postInvalidateOnAnimation();
    }

    private void drawHome(Canvas canvas){
        canvas.drawColor(Color.BLACK);
        if(homeBackground!=null) canvas.drawBitmap(homeBackground,null,new RectF(0,0,getWidth(),getHeight()),paint);
    }

    private void drawGame(Canvas canvas){
        drawComicBackground(canvas);
        drawHud(canvas);
        drawTargetPanel(canvas);
        drawBoard(canvas);
        drawBoosters(canvas);
    }

    private float anim(){ return (SystemClock.uptimeMillis()-animationStart)/1000f; }

    private void drawComicBackground(Canvas canvas){
        float w=getWidth(), h=getHeight(), t=anim();
        LinearGradient g=new LinearGradient(0,0,0,h,new int[]{Color.rgb(182,7,48),Color.rgb(82,8,48),Color.rgb(16,22,54),Color.rgb(8,9,18)},new float[]{0,.28f,.68f,1},Shader.TileMode.CLAMP);
        paint.setShader(g); canvas.drawRect(0,0,w,h,paint); paint.setShader(null);

        paint.setColor(Color.rgb(24,7,23));
        float dot=Math.max(2f,w*.005f);
        for(int r=0;r<14;r++) for(int c=0;c<18;c++) if(((r+c)&1)==0) canvas.drawCircle(w*(.01f+c*.058f),h*(.005f+r*.027f),dot,paint);

        float skyline=h*.74f;
        for(int i=0;i<16;i++){
            float left=i*w/16f, bw=w*(.045f+(i%3)*.012f), bh=h*(.05f+(i%5)*.018f);
            paint.setColor(Color.rgb(6,10,26)); canvas.drawRect(left,skyline-bh,left+bw,skyline,paint);
            paint.setColor(i%2==0?Color.rgb(255,198,41):Color.rgb(20,207,219));
            for(int rr=0;rr<3;rr++) canvas.drawRect(left+w*.009f,skyline-bh+h*.013f+rr*h*.016f,left+w*.015f,skyline-bh+h*.020f+rr*h*.016f,paint);
        }

        paint.setColor(Color.rgb(106,10,47));
        canvas.drawRoundRect(new RectF(0,h*.72f,w*.28f,h*.90f),w*.03f,w*.03f,paint);
        canvas.drawRoundRect(new RectF(w*.72f,h*.72f,w,h*.90f),w*.03f,w*.03f,paint);
        for(int r=0;r<5;r++) for(int c=0;c<7;c++){
            paint.setColor(((r+c)&1)==0?Color.rgb(238,230,210):Color.rgb(15,14,18));
            float l=c*w/7f, top=h*.90f+r*h*.022f; canvas.drawRect(l,top,l+w/7f,top+h*.022f,paint);
        }

        drawNeon("LIPSTICK",w*.11f,h*.62f,w*.037f,Color.rgb(255,56,128),canvas);
        drawNeon("LOUNGE",w*.11f,h*.65f,w*.026f,Color.rgb(20,210,221),canvas);
        drawNeon("BAM!",w*.90f,h*.65f,w*.055f,Color.rgb(255,56,128),canvas);
        drawBigLogo(canvas);
        drawMascot(canvas,w*.84f,h*.285f,w*.14f,t);
    }

    private void drawBigLogo(Canvas canvas){
        float w=getWidth(), h=getHeight(), cx=w*.50f, cy=h*.18f, outer=w*.27f, inner=w*.20f;
        Path burst=new Path();
        for(int i=0;i<24;i++){
            double a=-Math.PI/2+i*Math.PI/12; float rr=(i%2==0)?outer:inner;
            float x=cx+(float)Math.cos(a)*rr, y=cy+(float)Math.sin(a)*rr*.68f;
            if(i==0) burst.moveTo(x,y); else burst.lineTo(x,y);
        }
        burst.close(); paint.setColor(Color.rgb(248,241,216)); canvas.drawPath(burst,paint);
        outlineText("WAM",cx,cy-h*.055f,w*.075f,Color.rgb(239,20,93),canvas);
        outlineText("BAM",cx,cy,w*.087f,Color.rgb(255,184,25),canvas);
        outlineText("THANK U",cx,cy+h*.055f,w*.050f,Color.rgb(20,207,219),canvas);
        outlineText("MAM",cx,cy+h*.105f,w*.073f,Color.rgb(239,20,93),canvas);
    }

    private void outlineText(String value,float cx,float cy,float size,int fill,Canvas canvas){
        text.setTypeface(android.graphics.Typeface.DEFAULT_BOLD); text.setTextAlign(Paint.Align.CENTER); text.setTextSize(size);
        float yy=cy-(text.ascent()+text.descent())/2f;
        text.setStyle(Paint.Style.STROKE); text.setStrokeWidth(size*.16f); text.setColor(Color.rgb(18,14,18)); canvas.drawText(value,cx,yy,text);
        text.setStrokeWidth(size*.07f); text.setColor(Color.WHITE); canvas.drawText(value,cx,yy,text);
        text.setStyle(Paint.Style.FILL); text.setColor(fill); canvas.drawText(value,cx,yy,text);
    }

    private void drawNeon(String value,float cx,float cy,float size,int colour,Canvas canvas){
        text.setTypeface(android.graphics.Typeface.DEFAULT_BOLD); text.setTextAlign(Paint.Align.CENTER); text.setTextSize(size);
        text.setStyle(Paint.Style.STROKE); text.setStrokeWidth(size*.13f); text.setColor(Color.argb(85,Color.red(colour),Color.green(colour),Color.blue(colour))); canvas.drawText(value,cx,cy,text);
        text.setStrokeWidth(size*.045f); text.setColor(colour); canvas.drawText(value,cx,cy,text);
        text.setStyle(Paint.Style.FILL); text.setColor(Color.WHITE); canvas.drawText(value,cx,cy,text);
    }

    private void drawMascot(Canvas canvas,float cx,float cy,float s,float time){
        cy+=(float)Math.sin(time*.8f)*s*.025f;
        paint.setColor(Color.rgb(252,190,151)); canvas.drawOval(new RectF(cx-s*.32f,cy-s*.33f,cx+s*.32f,cy+s*.34f),paint);
        paint.setColor(Color.rgb(8,11,22)); canvas.drawCircle(cx-s*.20f,cy-s*.28f,s*.29f,paint); canvas.drawCircle(cx+s*.20f,cy-s*.28f,s*.29f,paint); canvas.drawCircle(cx+s*.31f,cy-s*.05f,s*.16f,paint);
        paint.setColor(Color.rgb(229,28,69));
        Path left=new Path(); left.moveTo(cx,cy-s*.40f); left.lineTo(cx-s*.34f,cy-s*.57f); left.lineTo(cx-s*.24f,cy-s*.25f); left.close(); canvas.drawPath(left,paint);
        Path right=new Path(); right.moveTo(cx,cy-s*.40f); right.lineTo(cx+s*.32f,cy-s*.57f); right.lineTo(cx+s*.24f,cy-s*.25f); right.close(); canvas.drawPath(right,paint);
        paint.setColor(Color.rgb(30,23,25)); paint.setStrokeWidth(s*.035f); canvas.drawLine(cx-s*.12f,cy-s*.02f,cx-s*.03f,cy-s*.02f,paint); canvas.drawLine(cx+s*.03f,cy-s*.02f,cx+s*.12f,cy-s*.02f,paint);
        paint.setColor(Color.rgb(220,30,63)); Path lips=new Path(); lips.moveTo(cx-s*.10f,cy+s*.15f); lips.quadTo(cx,cy+s*.08f,cx+s*.10f,cy+s*.15f); lips.quadTo(cx,cy+s*.24f,cx-s*.10f,cy+s*.15f); lips.close(); canvas.drawPath(lips,paint);
        paint.setColor(Color.rgb(255,195,41)); paint.setStyle(Paint.Style.STROKE); paint.setStrokeWidth(s*.045f); canvas.drawCircle(cx+s*.30f,cy+s*.12f,s*.09f,paint); paint.setStyle(Paint.Style.FILL);
    }

    private void drawHud(Canvas canvas){
        float w=getWidth(), h=getHeight();
        comicPanel(canvas,w*.02f,h*.018f,w*.19f,h*.125f,Color.rgb(239,20,93));
        centered(canvas,"MOVES",w*.105f,h*.045f,w*.032f,Color.WHITE); centered(canvas,String.valueOf(movesLeft),w*.105f,h*.090f,w*.068f,Color.WHITE);
        comicPanel(canvas,w*.58f,h*.018f,w*.92f,h*.078f,Color.rgb(24,24,28));
        paint.setColor(Color.rgb(255,197,31)); canvas.drawCircle(w*.615f,h*.048f,w*.026f,paint); centered(canvas,"$",w*.615f,h*.048f,w*.030f,Color.rgb(150,83,10)); centered(canvas,String.format("%,d",coins),w*.735f,h*.050f,w*.035f,Color.WHITE);
        circleButton(canvas,w*.885f,h*.048f,w*.034f,Color.rgb(239,20,93),"+",w*.038f);
        drawLifeHeart(canvas,w*.84f,h*.125f,w*.060f); centered(canvas,"FULL",w*.84f,h*.173f,w*.024f,Color.WHITE);
    }

    private void drawLifeHeart(Canvas canvas,float cx,float cy,float s){
        Path p=new Path(); p.moveTo(cx,cy+s*.45f); p.cubicTo(cx-s*.82f,cy,cx-s*.62f,cy-s*.62f,cx-s*.25f,cy-s*.55f); p.cubicTo(cx-s*.08f,cy-s*.52f,cx,cy-s*.34f,cx,cy-s*.22f); p.cubicTo(cx,cy-s*.34f,cx+s*.08f,cy-s*.52f,cx+s*.25f,cy-s*.55f); p.cubicTo(cx+s*.62f,cy-s*.62f,cx+s*.82f,cy,cx,cy+s*.45f); p.close();
        paint.setColor(Color.rgb(255,198,41)); canvas.drawPath(p,paint); canvas.save(); canvas.scale(.86f,.86f,cx,cy); paint.setColor(Color.rgb(239,20,93)); canvas.drawPath(p,paint); canvas.restore(); centered(canvas,String.valueOf(lives),cx,cy,s*.90f,Color.WHITE);
    }

    private void drawTargetPanel(Canvas canvas){
        float w=getWidth(), h=getHeight(); RectF panel=new RectF(w*.02f,h*.185f,w*.225f,h*.355f);
        paint.setColor(Color.rgb(248,239,211)); canvas.drawRoundRect(panel,w*.020f,w*.020f,paint); paint.setStyle(Paint.Style.STROKE); paint.setStrokeWidth(w*.008f); paint.setColor(Color.rgb(47,26,28)); canvas.drawRoundRect(panel,w*.020f,w*.020f,paint); paint.setStyle(Paint.Style.FILL);
        RectF ribbon=new RectF(w*.015f,h*.175f,w*.225f,h*.225f); paint.setColor(Color.rgb(218,41,91)); canvas.drawRoundRect(ribbon,w*.015f,w*.015f,paint); centered(canvas,"TARGET",w*.12f,h*.201f,w*.030f,Color.WHITE);
        targetRow(canvas,CHERRIES,cherriesLeft,h*.255f); targetRow(canvas,DIAMOND,diamondsLeft,h*.301f); targetRow(canvas,STAR,starsLeft,h*.347f);
    }

    private void targetRow(Canvas canvas,int kind,int value,float cy){ float w=getWidth(); RectF r=new RectF(w*.045f,cy-w*.033f,w*.111f,cy+w*.033f); drawPieceStatic(canvas,kind,r); centered(canvas,String.valueOf(Math.max(0,value)),w*.165f,cy,w*.034f,Color.rgb(45,30,30)); }

    private RectF boardRect(){ float w=getWidth(), h=getHeight(), size=Math.min(w*.79f,h*.455f); float left=(w-size)/2f, top=h*.375f; return new RectF(left,top,left+size,top+size); }

    private void drawBoard(Canvas canvas){
        RectF outer=boardRect(); paint.setColor(Color.argb(248,12,13,18)); float extra=outer.width()*.035f; canvas.drawRoundRect(new RectF(outer.left-extra,outer.top-extra,outer.right+extra,outer.bottom+extra),extra,extra,paint);
        LinearGradient frame=new LinearGradient(outer.left,outer.top,outer.right,outer.bottom,new int[]{Color.rgb(255,232,92),Color.rgb(255,105,15),Color.rgb(255,227,72)},null,Shader.TileMode.CLAMP); paint.setShader(frame); canvas.drawRoundRect(outer,outer.width()*.03f,outer.width()*.03f,paint); paint.setShader(null);
        float pad=outer.width()*.018f; RectF inner=new RectF(outer.left+pad,outer.top+pad,outer.right-pad,outer.bottom-pad); paint.setColor(Color.rgb(10,11,15)); canvas.drawRoundRect(inner,outer.width()*.022f,outer.width()*.022f,paint);
        float gap=inner.width()*.007f, cell=(inner.width()-gap*7f)/8f;
        for(int y=0;y<ROWS;y++) for(int x=0;x<COLS;x++){
            float l=inner.left+x*(cell+gap), t=inner.top+y*(cell+gap); RectF r=new RectF(l,t,l+cell,t+cell); paint.setColor(((x+y)&1)==0?Color.rgb(32,33,40):Color.rgb(24,25,31)); canvas.drawRoundRect(r,cell*.09f,cell*.09f,paint); drawPieceAnimated(canvas,board[x][y],r,x,y);
            if(x==selectedX && y==selectedY){ paint.setStyle(Paint.Style.STROKE); paint.setStrokeWidth(cell*.055f); paint.setColor(Color.WHITE); canvas.drawRoundRect(r,cell*.09f,cell*.09f,paint); paint.setStyle(Paint.Style.FILL); }
        }
    }

    private void drawPieceAnimated(Canvas canvas,int kind,RectF r,int gx,int gy){
        float phase=anim()*2f+gx*.53f+gy*.41f+kind*.77f, bob=(float)Math.sin(phase)*r.width()*.025f, scale=1f+(float)Math.sin(phase*.92f)*.035f, rot=0;
        if(kind==LIPSTICK) rot=(float)Math.sin(phase*.72f)*3f; else if(kind==CHERRIES) rot=(float)Math.sin(phase*.58f)*5f; else if(kind==STAR) rot=(float)Math.sin(phase*.36f)*8f; else if(kind==HEEL) rot=(float)Math.sin(phase*.80f)*4f;
        canvas.save(); canvas.translate(r.centerX(),r.centerY()+bob); canvas.rotate(rot); canvas.scale(scale,scale); RectF local=new RectF(-r.width()/2f,-r.height()/2f,r.width()/2f,r.height()/2f); drawPieceStatic(canvas,kind,local); float spark=(float)(.5+.5*Math.sin(phase*1.35)); if(kind==DIAMOND||kind==STAR||spark>.91f){ paint.setColor(Color.argb((int)(100+130*spark),255,255,255)); canvas.drawCircle(r.width()*.22f,-r.width()*.25f,r.width()*.045f,paint); } canvas.restore();
    }

    private void drawPieceStatic(Canvas canvas,int kind,RectF r){
        float cx=r.centerX(), cy=r.centerY(), s=Math.min(r.width(),r.height());
        if(kind==HEART){ Path p=new Path(); p.moveTo(cx,cy+s*.29f); p.cubicTo(cx-s*.43f,cy+s*.02f,cx-s*.38f,cy-s*.32f,cx-s*.16f,cy-s*.32f); p.cubicTo(cx-s*.04f,cy-s*.32f,cx,cy-s*.20f,cx,cy-s*.16f); p.cubicTo(cx,cy-s*.20f,cx+s*.04f,cy-s*.32f,cx+s*.16f,cy-s*.32f); p.cubicTo(cx+s*.38f,cy-s*.32f,cx+s*.43f,cy+s*.02f,cx,cy+s*.29f); p.close(); paint.setColor(Color.rgb(245,45,92)); canvas.drawPath(p,paint); }
        else if(kind==LIPSTICK){ paint.setColor(Color.rgb(28,24,28)); canvas.drawRoundRect(new RectF(cx-s*.13f,cy-s*.05f,cx+s*.13f,cy+s*.34f),s*.03f,s*.03f,paint); paint.setColor(Color.rgb(235,188,51)); canvas.drawRect(cx-s*.12f,cy-s*.10f,cx+s*.12f,cy+s*.12f,paint); paint.setColor(Color.rgb(255,54,132)); Path p=new Path(); p.moveTo(cx-s*.10f,cy-s*.08f); p.lineTo(cx-s*.06f,cy-s*.34f); p.lineTo(cx+s*.11f,cy-s*.27f); p.lineTo(cx+s*.10f,cy-s*.08f); p.close(); canvas.drawPath(p,paint); }
        else if(kind==CHERRIES){ paint.setStrokeWidth(s*.045f); paint.setColor(Color.rgb(61,177,71)); canvas.drawLine(cx-s*.13f,cy-s*.04f,cx-s*.02f,cy-s*.31f,paint); canvas.drawLine(cx+s*.13f,cy-s*.02f,cx-s*.02f,cy-s*.31f,paint); paint.setColor(Color.rgb(215,27,52)); canvas.drawCircle(cx-s*.15f,cy+s*.13f,s*.17f,paint); canvas.drawCircle(cx+s*.15f,cy+s*.13f,s*.17f,paint); }
        else if(kind==DIAMOND){ Path d=new Path(); d.moveTo(cx,cy-s*.35f); d.lineTo(cx+s*.29f,cy-s*.10f); d.lineTo(cx+s*.21f,cy+s*.25f); d.lineTo(cx,cy+s*.37f); d.lineTo(cx-s*.21f,cy+s*.25f); d.lineTo(cx-s*.29f,cy-s*.10f); d.close(); paint.setColor(Color.rgb(53,209,230)); canvas.drawPath(d,paint); paint.setStyle(Paint.Style.STROKE); paint.setStrokeWidth(s*.035f); paint.setColor(Color.WHITE); canvas.drawPath(d,paint); paint.setStyle(Paint.Style.FILL); }
        else if(kind==STAR){ paint.setColor(Color.rgb(255,193,35)); canvas.drawPath(starPath(cx,cy,s*.36f,s*.16f),paint); }
        else { paint.setColor(Color.rgb(230,44,71)); Path p=new Path(); p.moveTo(cx-s*.25f,cy-s*.18f); p.cubicTo(cx-s*.10f,cy-s*.16f,cx-s*.02f,cy+s*.12f,cx+s*.12f,cy+s*.18f); p.lineTo(cx+s*.28f,cy+s*.18f); p.lineTo(cx+s*.28f,cy+s*.31f); p.lineTo(cx-s*.02f,cy+s*.31f); p.cubicTo(cx-s*.18f,cy+s*.28f,cx-s*.25f,cy+s*.02f,cx-s*.25f,cy-s*.18f); p.close(); canvas.drawPath(p,paint); paint.setStrokeWidth(s*.06f); canvas.drawLine(cx+s*.17f,cy+s*.23f,cx+s*.17f,cy+s*.38f,paint); }
    }

    private Path starPath(float cx,float cy,float outer,float inner){ Path p=new Path(); for(int i=0;i<10;i++){ double a=-Math.PI/2+i*Math.PI/5; float rr=i%2==0?outer:inner, x=cx+(float)Math.cos(a)*rr, y=cy+(float)Math.sin(a)*rr; if(i==0)p.moveTo(x,y); else p.lineTo(x,y); } p.close(); return p; }

    private void drawBoosters(Canvas canvas){
        float w=getWidth(), h=getHeight(); String[] names={"ROCKET","HAMMER","DISCO BALL","SWAP"};
        for(int i=0;i<4;i++){ float cx=w*(.115f+i*.215f), cy=h*.895f, radius=w*.087f; paint.setColor(Color.rgb(21,180,196)); canvas.drawCircle(cx,cy,radius,paint); paint.setStyle(Paint.Style.STROKE); paint.setStrokeWidth(w*.010f); paint.setColor(Color.rgb(255,203,50)); canvas.drawCircle(cx,cy,radius,paint); paint.setStyle(Paint.Style.FILL);
            if(i==0) rocketIcon(canvas,cx,cy,radius*.72f); else if(i==1) hammerIcon(canvas,cx,cy,radius*.78f); else if(i==2) discoIcon(canvas,cx,cy,radius*.62f); else swapIcon(canvas,cx,cy,radius*.70f);
            circleButton(canvas,cx+radius*.72f,cy-radius*.70f,radius*.34f,Color.rgb(239,20,93),String.valueOf(boosterCounts[i]),w*.029f); RectF label=new RectF(cx-radius*.92f,cy+radius*.67f,cx+radius*.92f,cy+radius*1.18f); paint.setColor(Color.rgb(22,18,21)); canvas.drawRoundRect(label,w*.012f,w*.012f,paint); centered(canvas,names[i],cx,cy+radius*.91f,w*(i==2?.022f:.024f),Color.WHITE); }
        circleButton(canvas,w*.92f,h*.905f,w*.060f,Color.rgb(239,20,93),"Ⅱ",w*.052f);
    }

    private void rocketIcon(Canvas canvas,float cx,float cy,float s){ canvas.save(); canvas.rotate(-35,cx,cy); paint.setColor(Color.WHITE); Path p=new Path(); p.moveTo(cx,cy-s*.48f); p.cubicTo(cx+s*.28f,cy-s*.25f,cx+s*.22f,cy+s*.17f,cx,cy+s*.30f); p.cubicTo(cx-s*.22f,cy+s*.17f,cx-s*.28f,cy-s*.25f,cx,cy-s*.48f); p.close(); canvas.drawPath(p,paint); paint.setColor(Color.rgb(230,38,68)); canvas.drawCircle(cx,cy-s*.05f,s*.10f,paint); paint.setColor(Color.rgb(255,198,41)); Path f=new Path(); f.moveTo(cx,cy+s*.28f); f.lineTo(cx-s*.10f,cy+s*.48f); f.lineTo(cx+s*.10f,cy+s*.48f); f.close(); canvas.drawPath(f,paint); canvas.restore(); }
    private void hammerIcon(Canvas canvas,float cx,float cy,float s){ canvas.save(); canvas.rotate(-35,cx,cy); paint.setColor(Color.rgb(255,198,41)); canvas.drawRoundRect(new RectF(cx-s*.08f,cy-s*.05f,cx+s*.08f,cy+s*.48f),s*.04f,s*.04f,paint); paint.setColor(Color.rgb(238,64,103)); canvas.drawRoundRect(new RectF(cx-s*.34f,cy-s*.33f,cx+s*.34f,cy-s*.04f),s*.08f,s*.08f,paint); canvas.restore(); }
    private void discoIcon(Canvas canvas,float cx,float cy,float r){ paint.setColor(Color.rgb(213,86,223)); canvas.drawCircle(cx,cy,r,paint); paint.setStyle(Paint.Style.STROKE); paint.setStrokeWidth(Math.max(2,r*.06f)); paint.setColor(Color.WHITE); for(int i=-2;i<=2;i++){ canvas.drawLine(cx-r,cy+i*r*.32f,cx+r,cy+i*r*.32f,paint); canvas.drawLine(cx+i*r*.32f,cy-r,cx+i*r*.32f,cy+r,paint); } paint.setStyle(Paint.Style.FILL); }
    private void swapIcon(Canvas canvas,float cx,float cy,float s){ paint.setStrokeWidth(s*.12f); paint.setStrokeCap(Paint.Cap.ROUND); paint.setColor(Color.rgb(239,20,93)); canvas.drawLine(cx-s*.35f,cy-s*.17f,cx+s*.28f,cy-s*.17f,paint); canvas.drawLine(cx+s*.28f,cy-s*.17f,cx+s*.13f,cy-s*.32f,paint); paint.setColor(Color.rgb(255,198,41)); canvas.drawLine(cx+s*.35f,cy+s*.17f,cx-s*.28f,cy+s*.17f,paint); canvas.drawLine(cx-s*.28f,cy+s*.17f,cx-s*.13f,cy+s*.32f,paint); paint.setStrokeCap(Paint.Cap.BUTT); }

    private void comicPanel(Canvas canvas,float l,float t,float r,float b,int fill){ paint.setColor(Color.rgb(24,18,22)); canvas.drawRoundRect(new RectF(l-getWidth()*.006f,t-getWidth()*.006f,r+getWidth()*.006f,b+getWidth()*.006f),getWidth()*.02f,getWidth()*.02f,paint); paint.setColor(fill); canvas.drawRoundRect(new RectF(l,t,r,b),getWidth()*.018f,getWidth()*.018f,paint); paint.setStyle(Paint.Style.STROKE); paint.setStrokeWidth(getWidth()*.006f); paint.setColor(Color.rgb(255,199,44)); canvas.drawRoundRect(new RectF(l,t,r,b),getWidth()*.018f,getWidth()*.018f,paint); paint.setStyle(Paint.Style.FILL); }
    private void circleButton(Canvas canvas,float cx,float cy,float r,int fill,String label,float size){ paint.setColor(Color.rgb(25,20,24)); canvas.drawCircle(cx,cy,r*1.14f,paint); paint.setColor(Color.rgb(255,198,41)); canvas.drawCircle(cx,cy,r*1.05f,paint); paint.setColor(fill); canvas.drawCircle(cx,cy,r,paint); centered(canvas,label,cx,cy,size,Color.WHITE); }
    private void centered(Canvas canvas,String value,float cx,float cy,float size,int colour){ text.setTypeface(android.graphics.Typeface.DEFAULT_BOLD); text.setTextAlign(Paint.Align.CENTER); text.setTextSize(size); text.setColor(colour); text.setStyle(Paint.Style.FILL); canvas.drawText(value,cx,cy-(text.ascent()+text.descent())/2f,text); }

    private void drawToast(Canvas canvas){ float w=getWidth(),h=getHeight(); comicPanel(canvas,w*.27f,h*.325f,w*.73f,h*.375f,Color.rgb(239,20,93)); centered(canvas,toast,w*.50f,h*.35f,w*.032f,Color.WHITE); }
    private void drawModal(Canvas canvas){ float w=getWidth(),h=getHeight(); paint.setColor(Color.argb(205,0,0,0)); canvas.drawRect(0,0,w,h,paint); RectF card=new RectF(w*.10f,h*.32f,w*.90f,h*.69f); paint.setColor(Color.rgb(18,20,28)); canvas.drawRoundRect(card,w*.035f,w*.035f,paint); paint.setStyle(Paint.Style.STROKE); paint.setStrokeWidth(w*.009f); paint.setColor(Color.rgb(255,198,41)); canvas.drawRoundRect(card,w*.035f,w*.035f,paint); paint.setStyle(Paint.Style.FILL); centered(canvas,modalTitle,w*.5f,h*.40f,w*.052f,Color.rgb(239,20,93)); centered(canvas,modalBody,w*.5f,h*.49f,w*.030f,Color.WHITE); comicPanel(canvas,w*.18f,h*.57f,w*.62f,h*.645f,Color.rgb(239,20,93)); centered(canvas,modalButton,w*.40f,h*.607f,w*.030f,Color.WHITE); comicPanel(canvas,w*.66f,h*.57f,w*.84f,h*.645f,Color.rgb(8,145,160)); centered(canvas,"CLOSE",w*.75f,h*.607f,w*.026f,Color.WHITE); }

    @Override public boolean onTouchEvent(MotionEvent e){ float x=e.getX(),y=e.getY(); if(e.getAction()==MotionEvent.ACTION_DOWN){ downX=x;downY=y;if(screen==GAME&&!modal){int[] c=cellAt(x,y);downCellX=c[0];downCellY=c[1];}return true;} if(e.getAction()==MotionEvent.ACTION_UP){ if(modal)handleModal(x,y); else if(screen==HOME)handleHome(x,y); else handleGame(x,y); return true;} return true; }

    private void handleHome(float x,float y){ float nx=x/getWidth(),ny=y/getHeight(); if(inside(nx,ny,.20f,.64f,.80f,.79f))startLevel(); else if(inside(nx,ny,0,.77f,.25f,.94f))showInfo("EVENTS","Timed events coming soon."); else if(inside(nx,ny,.25f,.77f,.50f,.94f))showInfo("SHOP","Coins and boosters coming soon."); else if(inside(nx,ny,.50f,.77f,.75f,.94f))showChoice("CHALLENGE","Finish all three targets in 16 moves.","PLAY",this::startLevel); else if(inside(nx,ny,.75f,.77f,1f,.94f))showInfo("SETTINGS","Sound and vibration are active."); }

    private void handleGame(float upX,float upY){ float nx=upX/getWidth(),ny=upY/getHeight(); if(inside(nx,ny,.86f,.84f,1f,1f)){showChoice("PAUSED","Game paused.","RESUME",()->{});return;} if(ny>.82f){ if(nx<.215f)activateBooster(0); else if(nx<.43f)activateBooster(1); else if(nx<.645f)activateBooster(2); else if(nx<.86f)activateBooster(3); return;} if(downCellX<0||downCellY<0)return; if(boosterMode>=0){handleBoosterCell(downCellX,downCellY);return;} float dx=upX-downX,dy=upY-downY,dist=(float)Math.sqrt(dx*dx+dy*dy); if(dist<getWidth()*.045f){tapCell(downCellX,downCellY);return;} int tx=downCellX,ty=downCellY;if(Math.abs(dx)>Math.abs(dy))tx+=dx>0?1:-1;else ty+=dy>0?1:-1;if(inBounds(tx,ty))trySwap(downCellX,downCellY,tx,ty); }

    private void tapCell(int x,int y){ if(selectedX<0){selectedX=x;selectedY=y;invalidate();return;} if(Math.abs(selectedX-x)+Math.abs(selectedY-y)==1){int sx=selectedX,sy=selectedY;selectedX=selectedY=-1;trySwap(sx,sy,x,y);}else{selectedX=x;selectedY=y;invalidate();} }
    private void trySwap(int x1,int y1,int x2,int y2){ swap(x1,y1,x2,y2);Set<Long> matches=findMatches();if(matches.isEmpty()){swap(x1,y1,x2,y2);toast("NO MATCH",500);}else{movesLeft--;feedback();resolve(matches);checkEnd();}invalidate(); }

    private void activateBooster(int which){ if(boosterCounts[which]<=0){toast("NONE LEFT",650);return;} boosterMode=which;selectedX=selectedY=-1;toast(which==0?"ROCKET: TAP A PIECE":which==1?"HAMMER: TAP A PIECE":which==2?"DISCO: TAP A COLOUR":"SWAP: TAP FIRST PIECE",1000);feedback(); }
    private void handleBoosterCell(int x,int y){ if(boosterMode==0){boosterCounts[0]--;Set<Long> cells=new HashSet<>();for(int cx=0;cx<COLS;cx++)cells.add(pack(cx,y));for(int cy=0;cy<ROWS;cy++)cells.add(pack(x,cy));clearCells(cells,"ROCKET!");boosterMode=-1;} else if(boosterMode==1){boosterCounts[1]--;Set<Long> cells=new HashSet<>();cells.add(pack(x,y));clearCells(cells,"WHACK!");boosterMode=-1;} else if(boosterMode==2){boosterCounts[2]--;int kind=board[x][y];Set<Long> cells=new HashSet<>();for(int yy=0;yy<ROWS;yy++)for(int xx=0;xx<COLS;xx++)if(board[xx][yy]==kind)cells.add(pack(xx,yy));clearCells(cells,"DISCO!");boosterMode=-1;} else { if(selectedX<0){selectedX=x;selectedY=y;toast("SWAP: TAP NEXT PIECE",900);return;} if(Math.abs(selectedX-x)+Math.abs(selectedY-y)==1){swap(selectedX,selectedY,x,y);boosterCounts[3]--;selectedX=selectedY=-1;boosterMode=-1;feedback();Set<Long> m=findMatches();if(!m.isEmpty())resolve(m);checkEnd();invalidate();}else{selectedX=x;selectedY=y;toast("PICK AN ADJACENT PIECE",700);} } }

    private void clearCells(Set<Long> cells,String msg){ for(long v:cells){int x=(int)(v>>32),y=(int)v;if(board[x][y]>=0){record(board[x][y]);board[x][y]=-1;}} feedback();toast(msg,700);collapse();Set<Long> c=findMatches();if(!c.isEmpty())resolve(c);checkEnd();invalidate(); }
    private void resolve(Set<Long> matches){ while(!matches.isEmpty()){int count=matches.size();for(long v:matches){int x=(int)(v>>32),y=(int)v;if(board[x][y]>=0){record(board[x][y]);board[x][y]=-1;}}toast(count>=5?"BAM!":count>=4?"WAM!":"NICE!",600);collapse();matches=findMatches();}if(!findMove())shuffle(); }
    private void record(int kind){if(kind==CHERRIES&&cherriesLeft>0)cherriesLeft--;else if(kind==DIAMOND&&diamondsLeft>0)diamondsLeft--;else if(kind==STAR&&starsLeft>0)starsLeft--;}
    private void collapse(){for(int x=0;x<COLS;x++){int write=ROWS-1;for(int y=ROWS-1;y>=0;y--)if(board[x][y]>=0)board[x][write--]=board[x][y];while(write>=0)board[x][write--]=random.nextInt(6);}}

    private void generateBoard(){for(int y=0;y<ROWS;y++)for(int x=0;x<COLS;x++){ArrayList<Integer> choices=new ArrayList<>();for(int k=0;k<6;k++){boolean h=x>=2&&board[x-1][y]==k&&board[x-2][y]==k,v=y>=2&&board[x][y-1]==k&&board[x][y-2]==k;if(!h&&!v)choices.add(k);}board[x][y]=choices.get(random.nextInt(choices.size()));}if(!findMove())generateBoard();}
    private Set<Long> findMatches(){Set<Long> out=new HashSet<>();for(int y=0;y<ROWS;y++){int s=0;while(s<COLS){int k=board[s][y],e=s+1;while(e<COLS&&board[e][y]==k)e++;if(k>=0&&e-s>=3)for(int x=s;x<e;x++)out.add(pack(x,y));s=e;}}for(int x=0;x<COLS;x++){int s=0;while(s<ROWS){int k=board[x][s],e=s+1;while(e<ROWS&&board[x][e]==k)e++;if(k>=0&&e-s>=3)for(int y=s;y<e;y++)out.add(pack(x,y));s=e;}}return out;}
    private boolean findMove(){for(int y=0;y<ROWS;y++)for(int x=0;x<COLS;x++){int[][] d={{1,0},{0,1}};for(int[] q:d){int nx=x+q[0],ny=y+q[1];if(!inBounds(nx,ny))continue;swap(x,y,nx,ny);boolean ok=!findMatches().isEmpty();swap(x,y,nx,ny);if(ok)return true;}}return false;}
    private void shuffle(){List<Integer> values=new ArrayList<>();for(int y=0;y<ROWS;y++)for(int x=0;x<COLS;x++)values.add(board[x][y]<0?random.nextInt(6):board[x][y]);int guard=0;do{Collections.shuffle(values,random);int n=0;for(int y=0;y<ROWS;y++)for(int x=0;x<COLS;x++)board[x][y]=values.get(n++);guard++;}while((!findMatches().isEmpty()||!findMove())&&guard<100);if(guard>=100)generateBoard();}

    private int[] cellAt(float x,float y){RectF outer=boardRect();float pad=outer.width()*.018f;RectF inner=new RectF(outer.left+pad,outer.top+pad,outer.right-pad,outer.bottom-pad);if(!inner.contains(x,y))return new int[]{-1,-1};float gap=inner.width()*.007f,cell=(inner.width()-gap*7f)/8f;int cx=(int)((x-inner.left)/(cell+gap)),cy=(int)((y-inner.top)/(cell+gap));return inBounds(cx,cy)?new int[]{cx,cy}:new int[]{-1,-1};}
    private void startLevel(){screen=GAME;movesLeft=START_MOVES;cherriesLeft=START_CHERRIES;diamondsLeft=START_DIAMONDS;starsLeft=START_STARS;selectedX=selectedY=-1;boosterMode=-1;for(int i=0;i<4;i++)boosterCounts[i]=3;modal=false;generateBoard();feedback();invalidate();}
    private void checkEnd(){if(cherriesLeft<=0&&diamondsLeft<=0&&starsLeft<=0){coins+=500;showChoice("WAM! YOU WON","Targets complete. +500 coins","PLAY AGAIN",this::startLevel);}else if(movesLeft<=0){lives=Math.max(0,lives-1);showChoice("OUT OF MOVES","Try again and finish the targets.","TRY AGAIN",this::startLevel);}}
    private void showInfo(String title,String body){showChoice(title,body,"OK",()->{});} private void showChoice(String title,String body,String button,Runnable action){modalTitle=title;modalBody=body;modalButton=button;modalAction=action;modal=true;feedback();invalidate();}
    private void handleModal(float x,float y){float nx=x/getWidth(),ny=y/getHeight();if(inside(nx,ny,.18f,.57f,.62f,.645f)){Runnable a=modalAction;modal=false;modalAction=null;feedback();if(a!=null)a.run();invalidate();}else if(inside(nx,ny,.66f,.57f,.84f,.645f)){modal=false;modalAction=null;feedback();invalidate();}}
    private void toast(String value,long ms){toast=value;toastUntil=System.currentTimeMillis()+ms;invalidate();}

    private void feedback(){tones.startTone(ToneGenerator.TONE_PROP_BEEP,40);try{if(Build.VERSION.SDK_INT>=31){VibratorManager m=(VibratorManager)getContext().getSystemService(Context.VIBRATOR_MANAGER_SERVICE);if(m!=null)m.getDefaultVibrator().vibrate(VibrationEffect.createOneShot(16,VibrationEffect.DEFAULT_AMPLITUDE));}else{Vibrator v=(Vibrator)getContext().getSystemService(Context.VIBRATOR_SERVICE);if(v!=null&&v.hasVibrator())v.vibrate(VibrationEffect.createOneShot(16,VibrationEffect.DEFAULT_AMPLITUDE));}}catch(Exception ignored){}}
    private boolean inside(float x,float y,float l,float t,float r,float b){return x>=l&&x<=r&&y>=t&&y<=b;} private boolean inBounds(int x,int y){return x>=0&&x<COLS&&y>=0&&y<ROWS;} private void swap(int x1,int y1,int x2,int y2){int v=board[x1][y1];board[x1][y1]=board[x2][y2];board[x2][y2]=v;} private long pack(int x,int y){return(((long)x)<<32)|(y&0xffffffffL);}
    @Override protected void onDetachedFromWindow(){tones.release();super.onDetachedFromWindow();}
}
