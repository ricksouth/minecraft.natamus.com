# -*- coding: utf-8 -*-
#!/usr/bin/env python
from datetime 							import datetime
import urllib.request
import pathlib
import os
import json
import shutil
import demjson
import io

# Updates mod file information via the CurseForge API.
# by Rick South.
def main():
	localpath = str(pathlib.Path(__file__).parent)
	url = "https://raw.githubusercontent.com/ricksouth/serilum-mc-mods/master/data/project_ids.json"

	# Copy README
	shutil.copy("C:/The Forge/serilum-mc-mods/README.md", "C:/The Forge/minecraft.natamus.com/data/README.md")

	slugs = []

	# Copy mod data from CurseForge.
	allglobaldata = "{"
	alldescriptions = {}
	for decl in urllib.request.urlopen(url):
		line = decl.decode('utf-8')
		if not ":" in line:
			continue

		line = line.replace(",", "").replace('"', '').strip()
		linespl = line.split(" : ")

		modname = linespl[0]
		slug = modname.lower().replace(" ", "-")
		slugs.append(slug)
		projectid = linespl[1]
		print(modname, projectid)

		modurl = "https://addons-ecs.forgesvc.net/api/v2/addon/" + projectid
		for mdecl in urllib.request.urlopen(modurl):
			moddata = mdecl.decode('utf-8')

			if allglobaldata != "{":
				allglobaldata += ","

			allglobaldata += '"' + modname + '" : ' + moddata
			break

		descdata = ""
		descurl = "https://addons-ecs.forgesvc.net/api/v2/addon/" + projectid + "/description"
		for mdecldesc in urllib.request.urlopen(descurl):
			descdata += mdecldesc.decode('utf-8')

		alldescriptions[slug] = descdata
		print("Processed " + modname + ".")
		

	allglobaldata += "}"

	print("File lengths:")
	print("allglobaldata: ", len(allglobaldata))
	print("alldescriptions: ", len(alldescriptions))

	with io.open('C:/The Forge/minecraft.natamus.com/data/mod_data.json', 'w', encoding="utf-8") as allfile:
		allfile.write(allglobaldata)

	with io.open('C:/The Forge/minecraft.natamus.com/data/description_data.json', 'w', encoding="utf-8") as descfile:
		descfile.write(demjson.encode(alldescriptions))

	print("Mod data generated.")

	print("\nCreating real html pages for scrapers.")
	for slug in slugs:
		os.makedirs("C:/The Forge/minecraft.natamus.com/" + slug, exist_ok=True)
		os.makedirs("C:/The Forge/minecraft.natamus.com/" + slug + "/changelog", exist_ok=True)
		shutil.copy("C:/The Forge/minecraft.natamus.com/index.html", "C:/The Forge/minecraft.natamus.com/" + slug + "/index.html")
		shutil.copy("C:/The Forge/minecraft.natamus.com/index.html", "C:/The Forge/minecraft.natamus.com/" + slug + "/changelog/index.html")

	return

if __name__ == '__main__':
	main()