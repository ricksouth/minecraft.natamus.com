# -*- coding: utf-8 -*-
#!/usr/bin/env python
from datetime 							import datetime
import urllib.request
import pathlib
import os

# Made for https://github.com/ricksouth/minecraft.natamus.com/
# to create a sitemap for https://minecraft.natamus.com/
# by Rick South.
def main():
	localpath = str(pathlib.Path(__file__).parent)
	url = "https://raw.githubusercontent.com/ricksouth/serilum-mc-mods/master/README.md"

	now = datetime.today()
	time = now.strftime('%Y%m%d%H%M%S')
	lastmod = now.strftime('%Y-%m-%d')

	with open(os.path.join(localpath, "sitemap.xml_" + time), 'w') as smfile:
		smfile.write('<?xml version="1.0" encoding="UTF-8"?>' + "\n")
		smfile.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' + "\n")

		# main page index.php
		smfile.write('	<url>' + "\n")
		smfile.write('		<loc>https://minecraft.natamus.com/</loc>' + "\n")
		smfile.write('		<lastmod>' + lastmod + '</lastmod>' + "\n")
		smfile.write('		<changefreq>daily</changefreq>' + "\n")
		smfile.write('		<priority>1.00</priority>' + "\n")
		smfile.write('	</url>' + "\n")

		# mod download page
		smfile.write('	<url>' + "\n")
		smfile.write('		<loc>https://minecraft.natamus.com/download/</loc>' + "\n")
		smfile.write('		<lastmod>' + lastmod + '</lastmod>' + "\n")
		smfile.write('		<changefreq>weekly</changefreq>' + "\n")
		smfile.write('		<priority>0.90</priority>' + "\n")
		smfile.write('	</url>' + "\n")

		for decl in urllib.request.urlopen(url):
			line = decl.decode('utf-8')
			if "/mc-mods/" in line:
				slug = line.split("/mc-mods/")[1].split(")")[0]

				# main subpage of *slug*
				smfile.write('	<url>' + "\n")
				smfile.write('		<loc>https://minecraft.natamus.com/' + slug + '/</loc>' + "\n")
				smfile.write('		<lastmod>' + lastmod + '</lastmod>' + "\n")
				smfile.write('		<changefreq>weekly</changefreq>' + "\n")
				smfile.write('		<priority>0.80</priority>' + "\n")
				smfile.write('	</url>' + "\n")

				# changelog page of *slug*
				smfile.write('	<url>' + "\n")
				smfile.write('		<loc>https://minecraft.natamus.com/' + slug + '/changelog/</loc>' + "\n")
				smfile.write('		<lastmod>' + lastmod + '</lastmod>' + "\n")
				smfile.write('		<changefreq>weekly</changefreq>' + "\n")
				smfile.write('		<priority>0.50</priority>' + "\n")
				smfile.write('	</url>' + "\n")

			if "Discontinued" in line:
				break

		smfile.write('</urlset>')

	return

if __name__ == '__main__':
	main()