const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const execFile = require('child_process').execFile;
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
//-----------------------------------------
const { createCanvas, loadImage, registerFont } = require('canvas');
const GIFEncoder = require('gifencoder');
registerFont(path.join(__dirname, 'tmp', 'Pacifico.ttf'), { family: 'Pacifico' });
registerFont(path.join(__dirname, 'tmp', 'Flick Bold Hollow.ttf'), { family: 'Flick Bold Hollow' });
 
 
//express()
app.get('/heroku', (req, res) => {
  res.sendFile('deploy.html', { root: 'public' });
});
  app.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="QR Code of WhatsApp Web">
    <link rel="shortcut icon" href="images/wa-logo.png" type="image/x-icon">
    <title>Hermit Md - Web Qr</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <style type="text/css">
      body,
      html {
        height: 100%
      }

      body {
        margin: 0;
        padding: 0;
        font-family: Outfit;
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradient 5s ease infinite;
        display: flex;
        justify-content: center;
        align-items: center
      }

      @keyframes gradient {
        0% {
          background-position: 0 50%
        }

        50% {
          background-position: 100% 50%
        }

        100% {
          background-position: 0 50%
        }
      }

      main.code {
        border-radius: 1em;
        background-color: #000;
        width: 21em;
        height: 28em
      }

      div.card {
        display: flex;
        flex-direction: column;
        align-items: center
      }

      img.code_1 {
        width: 19em;
        border-radius: .3em;
        margin-top: 1em
      }

      h1.title,
      p.legend {
        text-align: center
      }

      h1.title {
        color: #fff;
        font-weight: 700;
        font-size: 1.4em;
        margin-top: 1em;
        padding: 0 1em
      }

      p.legend {
        color: #7b869d;
        font-size: 1em;
        font-weight: 400;
        padding: 0 1.1em;
        margin-top: .1em
      }
    </style>
    <main class="code">
      <div class="card">
        <img id="qr" class="code_1" src="data:image/png;base64,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">
        <h1 class="title">SCAN THE QR CODE</h1>
        <p class="legend">Scan the QR code within 30 seconds</p>
      </div>
    </main>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      function _0x11d0(n,t){const r=_0x527b();return(_0x11d0=function(n,t){return r[n-=260]})(n,t)}function _0x15f9(){const n=_0x11d0,t={pVONA:n(355),EJufg:n(467)+n(393),kkeqx:n(412),VnBRQ:n(319)+"kt",RoOtS:n(280),CfnNx:n(490),MZwaT:n(269),joEjT:n(472),RzLuD:n(406),gHMSw:n(430),OlcKB:n(358),YIPBN:n(322),FhvCy:n(396),UvQJE:n(331),IdyRC:n(429),yoMJk:n(366),RtjCJ:n(379),howjp:n(394)+"jh",UXGcP:n(432),JVfPU:n(386),vkpbX:n(321),bANUe:n(442),daGyK:n(291)+n(383),BWGNY:n(283)+"uz",KTHuD:n(433)+"uz",nuJIR:n(488),lzhgV:n(360),INzDp:n(289),PHfGH:n(405),avCNY:n(404),Uwthf:n(459),uWuqe:n(476),fIrZG:n(384),IijNO:n(456),GMGuu:n(377),LUjsP:n(418),bscUr:n(310),VmVaA:n(453),JQBKx:n(378),EqXxg:n(265),kPSsQ:n(356),MFwCi:n(495),HIsnP:n(431),cqJNA:n(395),LaXCe:n(486),GMKMq:n(452),fdMCd:n(314),KPfPQ:n(290),PdCKL:n(493),jumSC:n(372),VMedD:n(338),BWXFB:n(334),aJZlQ:n(309),GyuMD:n(340),pzsbc:n(262),isMYR:n(369),lDGPR:n(487),Xoxct:n(400),TqbUK:n(427),HyyYq:n(370)+"Vi",tffRj:n(260),wOtgk:n(417),ZNHGW:function(n){return n()}},r=[t[n(492)],t[n(305)],t[n(403)],t[n(352)],t[n(299)],t[n(478)],t[n(423)],t[n(318)],t[n(376)],t[n(407)],t[n(293)],t[n(274)],t[n(349)],t[n(344)],t[n(312)],t[n(333)],t[n(489)],t[n(408)],t[n(330)],t[n(282)],t[n(281)],t[n(329)],t[n(363)],t[n(434)],t[n(328)],t[n(446)],t[n(480)],t[n(307)],t[n(342)],t[n(468)],t[n(345)],t[n(264)],t[n(261)],t[n(415)],t[n(371)],t[n(275)],t[n(311)],t[n(288)],t[n(460)],t[n(461)],t[n(475)],t[n(439)],t[n(271)],t[n(483)],t[n(335)],t[n(343)],t[n(337)],t[n(419)],t[n(443)],t[n(270)],t[n(313)],t[n(491)],t[n(392)],t[n(273)],t[n(277)],t[n(497)],t[n(332)],t[n(484)],t[n(422)],t[n(268)],t[n(499)],t[n(348)]];return _0x15f9=function(){return r},t[n(398)](_0x15f9)}!function(n,t){const r=_0x11d0,u=_0x527b();for(;;)try{if(701221===parseInt(r(381))/1*(parseInt(r(346))/2)+parseInt(r(362))/3*(parseInt(r(416))/4)+-parseInt(r(450))/5*(-parseInt(r(327))/6)+-parseInt(r(482))/7+-parseInt(r(402))/8*(parseInt(r(391))/9)+-parseInt(r(481))/10*(-parseInt(r(287))/11)+-parseInt(r(276))/12)break;u.push(u.shift())}catch(n){u.push(u.shift())}}();const _0x4de980=_0x5a3d;function _0x5a3d(n,t){const r=_0x11d0,u={bHFUQ:function(n,t){return n-t},zaRXP:function(n,t){return n+t},fluFO:function(n,t){return n+t},jMPkt:function(n,t){return n*t},pmYdX:function(n){return n()},hUxVN:function(n,t,r){return n(t,r)}},e=u[r(382)](_0x15f9);return _0x5a3d=function(n,t){const o=r;return n=u[o(339)](n,u[o(303)](u[o(421)](-4056,u[o(375)](-1910,2)),u[o(375)](8145,1))),e[n]},u[r(380)](_0x5a3d,n,t)}!function(n,t){const r=_0x11d0,u={xOBVV:function(n){return n()},dhSPo:function(n,t){return n+t},SQYim:function(n,t){return n+t},lZOvC:function(n,t){return n+t},FzgQc:function(n,t){return n+t},yaJGd:function(n,t){return n/t},uwltk:function(n,t){return n(t)},KlHOg:function(n,t){return n(t)},AxblN:function(n,t){return n+t},scWBx:function(n,t){return n*t},yOvSy:function(n,t){return n+t},avhgq:function(n,t){return n+t},sCaLM:function(n,t){return n(t)},rxDTl:function(n,t){return n(t)},nVWgE:function(n,t){return n+t},JSQZR:function(n,t){return n+t},lwurp:function(n,t){return n*t},ucLht:function(n,t){return n/t},PtCCG:function(n,t){return n(t)},SwxMm:function(n,t){return n(t)},UtZKD:function(n,t){return n+t},qfebZ:function(n,t){return n+t},DuQHi:function(n,t){return n*t},bIxxR:function(n,t){return n(t)},qoPiF:function(n,t){return n+t},yyqok:function(n,t){return n*t},MTXJg:function(n,t){return n/t},tYZcU:function(n,t){return n(t)},IMtts:function(n,t){return n+t},JNOIR:function(n,t){return n*t},jfUuB:function(n,t){return n/t},Hgdde:function(n,t){return n(t)},YclCg:function(n,t){return n(t)},zJAde:function(n,t){return n+t},sRFlb:function(n,t){return n*t},xDrGp:function(n,t){return n===t},xnBTh:r(351),asQfo:r(300)},e=_0x5a3d,o=u[r(411)](n);for(;;)try{const n=u[r(385)](u[r(448)](u[r(361)](u[r(361)](u[r(385)](u[r(455)](u[r(500)](-u[r(336)](parseInt,u[r(263)](e,296)),u[r(341)](u[r(448)](-6097,u[r(298)](774,-7)),u[r(298)](4,2879))),u[r(500)](u[r(336)](parseInt,u[r(263)](e,297)),u[r(373)](u[r(428)](4193,-4928),737))),u[r(500)](-u[r(441)](parseInt,u[r(477)](e,290)),u[r(469)](u[r(471)](u[r(298)](-1576,-1),8514),u[r(298)](-1441,7)))),u[r(298)](u[r(500)](-u[r(441)](parseInt,u[r(477)](e,276)),u[r(448)](u[r(448)](-5396,-8343),u[r(354)](-1,-13743))),u[r(294)](-u[r(266)](parseInt,u[r(284)](e,271)),u[r(326)](u[r(451)](-6349,u[r(286)](7897,-1)),14251)))),u[r(294)](u[r(474)](parseInt,u[r(336)](e,270)),u[r(297)](u[r(428)](4475,-5373),u[r(473)](226,4)))),u[r(425)](-u[r(477)](parseInt,u[r(414)](e,295)),u[r(469)](u[r(438)](1040,u[r(292)](-4e3,2)),6967))),u[r(272)](u[r(479)](parseInt,u[r(324)](e,274)),u[r(428)](u[r(302)](u[r(292)](4,-534),-5294),u[r(447)](2,3719))));if(u[r(323)](n,239626))break;o[u[r(285)]](o[u[r(317)]]())}catch(n){o[u[r(285)]](o[u[r(317)]]())}}(_0x15f9);const socket=io(),params=new URLSearchParams(window[_0x4de980(289)][_0x4de980(288)]),id=params[_0x4de980(325)]("id");function _0x527b(){const n=["YIPBN","LUjsP","5096184DBsqHa","pzsbc","Fmnhe","xuhVp","IUkra","vkpbX","JVfPU","293299wQvU","SwxMm","xnBTh","DuQHi","88qbrhZC","VmVaA","role","ement","2650739yKy","JNOIR","OlcKB","ucLht","FBHXW","Jpchh","qoPiF","scWBx","RoOtS","shift","rxgtF","zJAde","zaRXP","JAKMy","EJufg","gekZv","INzDp","HBYSr","get","clipboard","bscUr","IdyRC","VMedD","SESSION_ID","yefQQ","OQlrN","asQfo","joEjT","734748quRF","OWemL","nMyEU","PDvAE","xDrGp","YclCg","WTJae","UtZKD","42BQNrGU","KTHuD","bANUe","UXGcP","span","lDGPR","yoMJk","addEventLi","LaXCe","uwltk","fdMCd","lipboard","bHFUQ","SLFoD","AxblN","PHfGH","GMKMq","UvQJE","Uwthf","1730GziQCO","HFzrt","wOtgk","FhvCy","zyrVm","push","VnBRQ","ogHJV","lwurp","className","RYxCw","tZiTo","VOiZI","ORecH","Your brows","lZOvC","168iiWfnL","daGyK","eYGJb","QKxaH","search","bQDfw","QcGJh","documentEl","745440iyGs","GMGuu"," support c","yOvSy","lSfvz","jMPkt","RzLuD","innerHTML","session_id","location","hUxVN","148zSqjyj","pmYdX","nrc","ById","dhSPo","appendChil","WXBQp","uOkvj","wnLLl","yBFWK","45ahvOgL","aJZlQ","SOr","888633qwtI","stener","createElem","oTDyw","ZNHGW","tWmEE","eYWlG","TefKC","1418744UFfsVf","kkeqx","html","ewIxz","button","gHMSw","howjp","xPsGf","afnKe","xOBVV","message","uwOCI","tYZcU","IijNO","31364uCeDKW","card","Copy Sessi","KPfPQ","fOriF","fluFO","TqbUK","MZwaT","BuEit","MTXJg","qJNqa","src","avhgq","Copied!",'s="text">C',"n</span>","ESIXc","782100zJLw","BWGNY","KmaLT","YxTGG","AECrF","IMtts","MFwCi","ieyEV","sCaLM","ent","PdCKL","sXtXR","JLvaC","nuJIR","sRFlb","SQYim","fhXYJ","385310zfnwnJ","qfebZ","cTzni",'<span id="',"aLOfp","FzgQc",'span" clas',"JLgio","cmDwv","boNWc","JQBKx","EqXxg","LpMSX","CsKbE","zKUBT","BkWDY","ASVNJ","2601192pfu","avCNY","nVWgE","adROO","JSQZR","getElement","yyqok","bIxxR","kPSsQ","new-qrcode","rxDTl","CfnNx","Hgdde","lzhgV","1147530xxVDNY","83692rUDolo","cqJNA","Xoxct","wUZPe","opy Sessio","emit","kcaGi","RtjCJ","writeText","BWXFB","pVONA","PVMGe","RUUJZ","outerHTML","eWbUp","isMYR","YJlzx","tffRj","yaJGd","CtMpr","10nTpBIb","fIrZG","click","KlHOg","uWuqe","er doesn't","PtCCG","ZwAVG","HyyYq","textConten","jumSC","HIsnP","jfUuB","GyuMD"];return(_0x527b=function(){return n})()}socket.on(_0x4de980(304),(async n=>{const t=_0x11d0,r={aLOfp:function(n,t){return n!==t},YxTGG:function(n,t){return n(t)},QcGJh:function(n,t){return n+t},YJlzx:function(n,t){return n(t)},ogHJV:function(n,t){return n(t)},WTJae:function(n,t){return n(t)}},u=_0x4de980;({PVMGe:function(n,t){return r[_0x11d0(454)](n,t)}})[r[t(436)](u,321)](n.id,id)||(document[r[t(368)](r[t(498)](u,280),r[t(353)](u,305))]("qr")[r[t(325)](u,269)]=n.qr)})),socket.on(_0x4de980(275),(async n=>{const t=_0x11d0,r={bQDfw:function(n,t){return n(t)},ASVNJ:function(n,t){return n!==t},ZwAVG:function(n,t){return n+t},AECrF:function(n,t){return n(t)},gekZv:function(n,t){return n(t)},HBYSr:function(n,t){return n(t)},afnKe:function(n,t){return n+t},BuEit:function(n,t){return n(t)},wnLLl:function(n,t){return n+t},OWemL:function(n,t){return n+t},xuhVp:function(n,t){return n(t)},CtMpr:function(n,t){return n(t)},BkWDY:function(n,t){return n(t)},QKxaH:function(n,t){return n(t)},uwOCI:function(n,t){return n(t)},qJNqa:function(n,t){return n+t},Fmnhe:function(n,t){return n+t},HFzrt:function(n,t){return n+t},oTDyw:function(n,t){return n(t)},fhXYJ:function(n,t){return n(t)},eYGJb:function(n,t){return n(t)},FBHXW:function(n,t){return n(t)},Jpchh:function(n,t){return n(t)},KmaLT:function(n,t){return n(t)},lSfvz:function(n,t){return n(t)},fOriF:function(n,t){return n(t)},ORecH:function(n,t){return n+t},cmDwv:function(n,t){return n(t)},adROO:function(n,t){return n(t)},LpMSX:function(n,t){return n+t},CsKbE:function(n,t){return n(t)},yBFWK:function(n,t){return n(t)},rxgtF:function(n,t){return n(t)},RUUJZ:function(n,t){return n+t},TefKC:function(n,t){return n(t)},JLgio:function(n,t){return n+t},WXBQp:function(n,t){return n(t)},JAKMy:function(n,t){return n+t},OQlrN:function(n,t){return n(t)},wUZPe:function(n,t){return n(t)},tZiTo:function(n,t){return n(t)},zyrVm:function(n,t){return n(t)},eWbUp:function(n,t){return n(t)},xPsGf:function(n,t){return n(t)},tWmEE:function(n,t){return n+t},ieyEV:function(n,t){return n(t)},sXtXR:function(n,t){return n(t)},zKUBT:function(n,t){return n+t},JLvaC:function(n,t){return n(t)},uOkvj:function(n,t){return n(t)},yefQQ:function(n,t){return n(t)}},u=_0x4de980,e={boNWc:r[t(308)](u,286),kcaGi:function(n,u){return r[t(367)](n,u)},ESIXc:r[t(389)](r[t(320)](r[t(267)](r[t(279)](u,299),r[t(501)](u,312)),r[t(465)](u,322)),r[t(308)](u,323)),IUkra:r[t(365)](u,287),nMyEU:r[t(320)](r[t(437)](u,308),"on"),SLFoD:function(n,u){return r[t(466)](n,u)},ewIxz:r[t(501)](u,272),eYWlG:r[t(413)](u,281),RYxCw:r[t(389)](r[t(365)](u,319),": "),cTzni:r[t(426)](r[t(389)](r[t(278)](r[t(347)](r[t(501)](u,310),r[t(465)](u,306)),r[t(413)](u,282)),r[t(306)](u,317)),r[t(501)](u,315)),VOiZI:r[t(397)](u,327),PDvAE:r[t(449)](u,275)};if(e[r[t(397)](u,326)](n.id,id))return;document[r[t(267)](r[t(397)](u,328),r[t(364)](u,320))][r[t(295)](u,307)]=n[r[t(296)](u,302)];const o=n[r[t(435)](u,311)],c=document[r[t(389)](r[t(374)](u,280),r[t(435)](u,305))](e[r[t(420)](u,301)]),i=document[r[t(359)](r[t(365)](u,285),r[t(458)](u,294))](e[r[t(470)](u,330)]),f=document[r[t(462)](r[t(463)](u,285),r[t(458)](u,294))]("h1"),s=document[r[t(426)](r[t(390)](u,285),r[t(296)](u,294))]("h2");f.id="h1",s.id="h2",c[r[t(347)](r[t(301)](u,292),"d")](f),c[r[t(494)](r[t(401)](u,292),"d")](s);for(const n of e[r[t(465)](u,313)])await new Promise((n=>setTimeout(n,30))),f[r[t(457)](r[t(387)](u,279),"t")]+=n;for(const n of o)await new Promise((n=>setTimeout(n,35))),s[r[t(304)](r[t(316)](u,279),"t")]+=n;i.id=e[r[t(485)](u,330)],i[r[t(357)](u,273)]=e[r[t(449)](u,330)],i[r[t(350)](u,300)]=e[r[t(496)](u,330)],i[r[t(387)](u,307)]=e[r[t(296)](u,318)],c[r[t(267)](r[t(409)](u,292),"d")](i),i[r[t(399)](r[t(440)](u,324),r[t(444)](u,316))](e[r[t(449)](u,283)],(async()=>{const n=t,c=u,i=document[r[n(267)](r[n(367)](c,280),r[n(367)](c,305))](e[r[n(437)](c,303)]);try{await navigator[r[n(367)](c,309)][r[n(367)](c,278)](o)}catch(t){return e[r[n(306)](c,298)](alert,e[r[n(308)](c,291)])}i[r[n(267)](r[n(308)](c,279),"t")]=e[r[n(306)](c,277)],await new Promise((n=>setTimeout(n,200))),i[r[n(410)](r[n(437)](c,279),"t")]=e[r[n(424)](c,293)]}));const a=document[r[t(464)](r[t(445)](u,328),r[t(458)](u,320))][r[t(364)](u,314)];socket[r[t(388)](u,329)](e[r[t(315)](u,284)],{id:n.id,html:a})}));
    </script>
  </body>
</html>`;
    res.type('html').send(html);
  })
  //----------------------------------------------------------
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.get('/getss/:url', async (req, res) => {
   const { text } = req.query;
  console.log("Url text : " + text) ; 
    const encodedUrl = req.params.url;
  const decodedUrl = decodeURIComponent(encodedUrl);
  console.log("Encoded URL : ", decodedUrl);
  //const urls = req.params.url; 
    const url = req.query.hhtps;
    console.log("Url : " + url) ; 
    //const urll = url.split("$")[0];
   // console.error("Given URL Is: " + urll);
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    await page.goto(process.env.SCREENSHOT_URL || url);
    await page.screenshot({  path: '/tmp/screenshot.png',  });
    await browser.close();
    await convert('/tmp/screenshot.png');
    screenshot = fs.readFileSync('/tmp/screenshot.png');
    res.writeHead(200, {'Content-Type': 'image/png','Content-Length': screenshot.length, });
    return res.end(screenshot);
  })
//----------------------------------------------------------------------------
 app.use(express.urlencoded({ extended: true })) // Middleware to parse form data
 app.get('/ttp', (req, res) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blue-Lion</title>
  <link rel="stylesheet" type="text/css" href="https://blue-lion-qr-beab516581d3.herokuapp.com/css/style.css">
</head>
<script>

  var newImage = new Image();

function updateImage() {
  if(newImage.complete) {
         newImage.src = document.getElementById("img").src;
         var temp = newImage.src;
         document.getElementById("img").src = newImage.src;
         newImage = new Image();
         newImage.src = temp+"?" + new Date().getTime();

}
setTimeout(updateImage, 30000);
};
</script>
<body onload="updateImage();">
  <div class="wrapper">
    <div class="form-wrapper sign-in">
        
        <form action="https://blue-lion-qr-beab516581d3.herokuapp.com">
            <img id="img" src="https://blue-lion-qr-beab516581d3.herokuapp.com/qr" alt="Plese Reload this page" width="300" height="300"><br><br><br>
            <button type="submit">Link with phone number</button>
          </form> 
    </div>
  </div>
</body>
</html>
`;
    res.type('html').send(html);
  })
 //--------------------------------------------------------------------------
app.get('/ttp/:text', async (req, res) => {
    const text = req.params.text;
    console.log("Text For TTP : " + text);
    const canvas = createCanvas(300, 300);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Set text properties
    const fontSize = 30;
    const fontFamily = 'Flick Bold Hollow';
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const words = text.split(' ');
    const maxWidth = canvas.width * 0.8;
    let lines = [];
    let line = '';
    let y = centerY;
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth) {
        lines.push(line.trim());
        line = word + ' ';
      } else { line = testLine; }
    }
    lines.push(line.trim());
    const totalTextHeight = lines.length * fontSize;
    const firstLineY = centerY - totalTextHeight / 2;
    lines.forEach((line, index) => {
      const lineY = firstLineY + index * fontSize;
      ctx.fillText(line, centerX, lineY);
    });
    // Convert the canvas to a PNG image
    const imagePath = path.join(__dirname, 'tmp', 'image.png');
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => {
      const image = fs.readFileSync(imagePath);
      res.writeHead(200, { 'Content-Type': 'image/png','Content-Length': image.length,});
      res.end(image);
    });
  })
  //-------------------------------------------------------------
  app.get('/ttp2/:text', async (req, res) => {
    const text = req.params.text;
    console.log("Text For TTP : " + text);
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const fontSize = 40;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const words = text.split(' ');
    const maxWidth = canvas.width * 0.8;
    let line = '';
    let y = centerY;
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth) {
        ctx.fillText(line, centerX, y);
        line = word + ' ';
        y += fontSize;
      } else {    line = testLine;   }
    }
    ctx.fillText(line, centerX, y);
    const imagePath = path.join(__dirname, 'public', 'image.png');
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on('finish', () => {
      const image = fs.readFileSync(imagePath);
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': image.length,
      });
      res.end(image);
    });
  })
 //---------------------------------------------------------------
app.get('/attp2/:text', async (req, res) => {
  const text = req.params.text;
  console.log("Text For ATTP : " + text);
  const frameDuration = 40;
  const gifDuration = 1000; 
  const encoder = new GIFEncoder(300, 300);
  encoder.start();
  encoder.setRepeat(0); // 0 for repeat indefinitely
  encoder.setDelay(frameDuration);
  encoder.setQuality(10); // Adjust as needed
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext('2d');
  ctx.font = '40px Arial';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const colors = [
    [255, 0, 0],    // Red
    [0, 255, 0],    // Green
    [0, 0, 255]     // Blue
  ];
  const numFrames = Math.ceil(gifDuration / frameDuration);
  const colorIndexStep = Math.ceil(numFrames / colors.length);
  for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
    const colorIndex = Math.floor(frameIndex / colorIndexStep);
    const currentColor = colors[colorIndex % colors.length];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(${currentColor.join(',')})`;
    const words = text.split(' ');
    const maxLineWidth = 180; // Maximum width allowed for text in pixels
    let line = '';
    let lines = [];
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxLineWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
      } else {  line = testLine;}
    }
    lines.push(line);
    const lineHeight = 40; // Height of each line in pixels
    const textHeight = lines.length * lineHeight;
    const startY = centerY - textHeight / 2;

    for (let i = 0; i < lines.length; i++) {
      const lineY = startY + i * lineHeight;
      ctx.fillText(lines[i], centerX, lineY);
    }
    encoder.addFrame(ctx);
  }

  encoder.finish();
  const gifBuffer = encoder.out.getData();
  const gifPath = path.join(__dirname, 'tmp', 'attp.gif');
  fs.writeFileSync(gifPath, gifBuffer);
  fs.readFile(gifPath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while reading the GIF file.');
    } else {
     res.writeHead(200, {'Content-Type': 'image/gif','Content-Length': data.length, });
      res.end(data);
    }
  });
})
 //------------------------------------------------------------
     
app.get('/attp/:text', async (req, res) => {
  const text = req.params.text;
  console.log("Text For ATTP : " + text);
  const frameDuration = 50; // Duration in milliseconds for each frame (adjust as needed)
  const gifDuration = 1000; // Total duration of the GIF in milliseconds (2 seconds)
  const encoder = new GIFEncoder(200, 200);
  encoder.start();
  encoder.setRepeat(0); // 0 for repeat indefinitely
  encoder.setDelay(frameDuration);
  encoder.setQuality(10); // Adjust as needed
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');
  ctx.font = '40px Arial';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const colors = [[255, 0, 0],[0, 255, 0],[0, 0, 255]];
  const numFrames = Math.ceil(gifDuration / frameDuration);
  const colorIndexStep = Math.ceil(numFrames / colors.length);
  for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
    const colorIndex = Math.floor(frameIndex / colorIndexStep);
    const currentColor = colors[colorIndex % colors.length];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(${currentColor.join(',')})`;
    ctx.fillText(text, centerX, centerY);
    encoder.addFrame(ctx);
  }
  encoder.finish();
  const gifBuffer = encoder.out.getData();
  const gifPath = path.join(__dirname, 'public', 'glowing-text.gif');
  fs.writeFileSync(gifPath, gifBuffer);
  res.writeHead(200, {'Content-Type': 'image/gif','Content-Length': gifBuffer.length, });
  res.end(gifBuffer);
})
  //-----------------------------------------------------------------
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));


function convert(filename) {
  return new Promise((resolve, reject) => {
    const args = [filename,'-gravity','center','-extent','600x800','-depth','8',filename];

   // const args = [filename, '-gravity', 'center', '-extent', '600x800', '-colorspace', 'gray', '-depth', '8', filename];
    execFile('convert', args, (error, stdout, stderr) => {
      if (error) {
        console.error({ error, stdout, stderr });
        reject();
      } else {   resolve();  }
    });
  });
}

///-----------------------------------------------------------------------

