# -*- coding: utf-8 -*-
#!/usr/bin/env python
from datetime 							import datetime
import urllib.request
import pathlib
import os
import json
import shutil

# Updates mod file information via the CurseForge API.
# by Rick South.
def main():
	localpath = str(pathlib.Path(__file__).parent)
	url = "https://raw.githubusercontent.com/ricksouth/serilum-mc-mods/master/data/project_ids.json"

	# Copy README
	shutil.copy("C:/The Forge/serilum-mc-mods/README.md", "C:/The Forge/minecraft.natamus.com/data/README.md")

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
		projectid = linespl[1]
		print(modname, projectid)

		modurl = "https://addons-ecs.forgesvc.net/api/v2/addon/" + projectid
		for mdecl in urllib.request.urlopen(modurl):
			moddata = mdecl.decode('utf-8')

			if allglobaldata != "{":
				allglobaldata += ","

			allglobaldata += '"' + modname + '" : ' + moddata
			break

		descurl = "https://addons-ecs.forgesvc.net/api/v2/addon/" + projectid + "/description"
		for mdecldesc in urllib.request.urlopen(descurl):
			descdata = mdecldesc.decode('utf-8')
			alldescriptions[slug] = descdata
			break

		print("Processed " + modname + ".")

	allglobaldata += "}"

	print("File lengths:")
	print("allglobaldata: ", len(allglobaldata))
	print("alldescriptions: ", len(alldescriptions))

	with open('C:/The Forge/minecraft.natamus.com/data/mod_data.json', 'w') as allfile:
		allfile.write(allglobaldata)

	with open('C:/The Forge/minecraft.natamus.com/data/description_data.json', 'w') as descfile:
		descfile.write(json.dumps(alldescriptions))

	print("Mod data generated.")
	return

if __name__ == '__main__':
	main()