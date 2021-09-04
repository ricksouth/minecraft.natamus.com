<!DOCTYPE html>
<html lang="{{ site.lang | default: 'en-US' }}">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Serilum's CurseForge Mods</title>
		<link rel="shortcut icon" href="/favicon.ico">
		<title>minecraft.natamus.com | A website with an overview of mods released on the Serilum CurseForge profile.</title>
		<meta name="generator" content="Jekyll v3.9.0" />
		<meta property="og:title" content="minecraft.natamus.com" />
		<meta property="og:locale" content="en_US" />
		<meta name="description" content="A website with an overview of mods released on the Serilum CurseForge profile." />
		<meta property="og:description" content="A website with an overview of mods released on the Serilum CurseForge profile." />
		<link rel="canonical" href="http://minecraft.natamus.com/" />
		<meta property="og:url" content="http://minecraft.natamus.com/" />
		<meta property="og:site_name" content="minecraft.natamus.com" />
		<meta name="twitter:card" content="summary" />
		<meta property="twitter:title" content="minecraft.natamus.com" />
		<script type="application/ld+json">
		{"description":"A website with an overview of mods released on the Serilum CurseForge profile.","url":"http://minecraft.natamus.com/","@type":"WebSite","headline":"minecraft.natamus.com","name":"minecraft.natamus.com","@context":"https://schema.org"}</script>
		<link rel="stylesheet" href="/assets/css/style.css">
		<link rel="stylesheet" href="/assets/external/css/font-awesome.min.css">
		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-91709614-3"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());

			gtag('config', 'UA-91709614-3', { 'anonymize_ip': true }); // GDPR compliant
		</script>
		<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7103228011189262" crossorigin="anonymous"></script>
	</head>
	<body>
		<div class="wrapper">
			<section id="topwrapper">
				<div class="shoppingwrapper">
					<div class="shoppingcart noselect">
						<i class="fa fa-shopping-cart" aria-hidden="true"></i>
						<div class="collapse">⇓</div>
						<p><span class="selectamount">0</span> <span class="modcount">mods</span> in cart</p>
					</div>
					<div class="insidecart" hidden>
						<div class="emptywrapper">
							<img class="emptyimage" src="/assets/images/empty-cart.png">
						</div>
						<div class="inventory"></div>
						<button id="downloadcart" class="downloadcartbutton">Download <span class="selectamount">0</span> <span class="modcount">mods</span></button>
					</div>
				</div>
				<div class="insidetw">
					<a href="/"><img class="serilum" src="/assets/images/serilum-with-mouth.png"></a>
					<h1 class="centered uppertitle">Serilum's CurseForge Mods<br>for Minecraft</h1>
					<p class="centered">The_active mod collection consists of <span id="totalmods">...</span> mods, with a total of <span id="totaldownloads">...</span>* downloads.</p>
					<p class="small centered">* Download counts are dependent on the CurseForge API and are not entirely up-to-date.</p>
				</div>
				<div class="belowtw" hidden>
					<p>Hi! I'm glad you've found this far corner of the internet. Here you'll find an overview of all the mods I've created and uploaded on CurseForge. With now almost a decade of experience in modding and even more with Minecraft, I felt it was time to put some more effort into public projects. It started off with the Just Mob Heads mod, and quickly got out of hand.</p>
					<p>With so many awesome mods and massive amounts of content already available, I wanted to do things a little bit differently. Instead of adding more and more features to a singular mod, I decided to make most of them minimalistically themed, by changing or adding a single feature. This way you can add a little bit extra to whatever collection you're playing without needing to extensively read a guide. The result can be seen below. I'm proud to share them all with you for free, and hope to be able to share many more in the future.</p>
					<p>You can filter the mods by clicking the category tag images below, or by adding a search query in the text input. This will change the mods shown immediately. Clicking on a mod shows all its information and some useful links.</p>
					<p>If you're interested in supporting the development of my mods, please check out my <a href="https://patreon.com/ricksouth" target=_blank>Patreon page</a>. Thank you and enjoy the collection!</p><br>
					<p align="center" class="mainad"><!-- MC Home Top --><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-7103228011189262" data-ad-slot="2670506854" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
				</div>
			</section>

			<section id="content" hidden></section>
			<section id="singular" class="singular" style="display: none;">
				<div class="jumpwrapper">
					<input type="text" placeholder="Quick mod search navigation_">
					<div class="resultwrapper" hidden></div>
				</div>
				<div class="navigation noselect">
					<div class="left">
						<p id="leftarrow">← Previous mod</p>
						<p id="previousmod" class="sub"></p>
					</div>
					
					<div class="middle"><p>↑ Back to overview ↑</p></div>

					<div class="right">
						<p id="rightarrow">Next mod →</p>
						<p id="nextmod" class="right sub"></p>
					</div>
				</div>
				<div class="modinfo">
					<h1 id="sngltitle" value=""></h1>
					<div class="changelognav noselect">
						<p><img src="/assets/images/changelog-right.png"><span>Show version changelog -></span></p>
					</div>
					<div class="snglimagewrapper">
						<img id="snglimage" src="">
						<div class="changelog" hidden></div>
					</div>
					<table class="subinfo">
						<tr id="sngltags"><td>Categories:</td> <td class="val"></td></tr>
						<tr id="snglcreated"><td>Date Created:</td> <td class="val"></td></tr>
						<tr id="snglmodified"><td>Last Modified</td> <td class="val"></td></tr>
					</table>
				</div>

				<div class="moddownloads">
					<h1>Downloads</h1>
					<p class="versiondl"><span id="dlcount"></span> in total.</p>
					<div id="versionwrapper"></div>
				</div>

				<div id="sngldescription">Description</div>
			</section>

			<footer>
				<p class="footercontent">
					<small>© Created by <a href="https://south.fyi/" target=_blank>Rick South</a>.<br></small>
					<small>Hosted on <a href="https://pages.github.com/" target=_blank>GitHub Pages</a>, <a href="https://github.com/ricksouth/minecraft.natamus.com/" target=_blank>source</a>.</small>
				</p>
			</footer>

			<div class="toasterwrapper"></div>
			<div class="tooltipwrapper" hidden>
				<p id="tooltip" class="tooltip"></p>
			</div>
			<section id="inlinestyle"></section>
		</div>
		<div class="dlscreenwrapper" hidden>
			<div class="dlscreen">
				<div class="closewrapper">
					<p>×</p>
				</div>
				<div class="dlcontent">
					<p id="dlad" align="center"><!-- MC Download Mods Screen --><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-7103228011189262" data-ad-slot="3306599974" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
					<p>Amazing! You're about to download <span class="selectamount">0</span> <span class="modcount">mods</span>! All that's left is to select your preferred Minecraft version. Keep in mind that not all mods are available for all versions. You'll be notified if a mod is incompatible.</p>
					<select id="selectversion">
						<option value="1.17">Minecraft 1.17</option>
						<option value="1.16">Minecraft 1.16</option>
						<option value="1.15">Minecraft 1.15</option>
						<option value="1.14">Minecraft 1.14</option>
						<option value="1.12">Minecraft 1.12</option>
					</select>
					<p class="sub">Out of your selection of <span class="selectamount">0</span> <span class="modcount">mods</span>, <span class="compatibleamount">0</span> <span class="areis">are</span> compatible with Minecraft <span class="minecraftversion">1.17</span>.</p>
					<div id="incompatibles"></div>
					<p>When clicking the button below, you'll receive a compressed (.zip) file containing a 'manifest' of the mods you've chosen.</p>
					<p>To download all the .jar mod archives, you'll need the open-sourced downloader <a href="https://github.com/Franckyi/CMPDL/releases" target=_blank>CMPDL by Franckyi</a>. On this page, download the file 'cmpdl-2.x.x.jar' (the latest release) and open it.</p>
					<img src="/assets/images/cmpdl.png"><br>
					<p class="imagedescription">A screenshot of the CMPDL program by Franckyi.</p>
					<p>Once opened, choose "From ZIP file", point it to the manifest zip file you download in a second. Below that, select a target folder where you want the mods downloaded to and click Start. That's it!</p>
					<p>Thank you very much for giving these mods a try! If you come across an issue, I'd appreciate it if you could submit it <a href="https://github.com/ricksouth/serilum-mc-mods/issues/new/choose" target=_blank>here</a> so I can fix them. Don't let me keep you any longer, click that button below.</p>
					<button id="startdownload">Start manifest download for <span class="compatibleamount">0</span> <span class="modcount">mods</span>.</button>
				</div>
			</div>
		</div>
	</body>

	<script type="text/javascript" src="/assets/js/scale.fix.js"></script>
	<script type="text/javascript" src="/assets/external/js/spa.js"></script>
	<script type="text/javascript" src="/assets/external/js/jquery-3.4.1.min.js"></script>
	<script type="text/javascript" src="/assets/external/js/jquery.waitforimages.min.js"></script>	
	<script type="text/javascript" src="/assets/external/js/js-cookie.js"></script>
	<script type="text/javascript" src="/assets/js/script.js"></script>
</html>