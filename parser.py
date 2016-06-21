#!/usr/bin/python2
import sys
import json
import copy


obj = {}

def main(file):
    id = 0
    with open(file) as f:
        content = f.readlines()

        tmp_text = {}
        text_id = 0
        key = ''
        for line in content:
            line = line.rstrip()
            if line not in ['\n', '\r\n']:
                if line[:2] == '/*': #case character and level
                    if id > 0:
                        obj[key]['what'].append(copy.deepcopy(tmp_text))
                        #print(tmp_obj)
                        #obj[key].append(copy.deepcopy(tmp_obj))
                        tmp_obj = {}
                    key = line[2:]
                    who = line[2:].partition("-")[0]


                    if key not in obj:
                        id += 1
                        obj[key] = {}
                        obj[key]['id'] = id
                        obj[key]['level'] = line[2:].partition("-")[2]
                        obj[key]['who'] = who
                        obj[key]['what'] = []
                        text_id = 0
                    else:
                        text_id = len(obj[key]['what'])

                elif line[:2] =='""': #case text
                    text = line[2:]
                    text_id += 1
                    tmp_text = {}
                    tmp_text['id'] = text_id
                    tmp_text['text'] = text
                    tmp_text['answers'] = []
                elif line[:2] =='--': #case answers
                    answer = line[2:]
                    tmp_text['answers'].append(copy.deepcopy(answer))
        obj[key]['what'].append(copy.deepcopy(tmp_text))


    tmp_obj = {}

    for key in obj:
        who = key.partition("-")[0]
        level = key.partition("-")[2]
        if who not in tmp_obj:
            tmp_obj[who] = {}
        if level not in tmp_obj[who]:
            tmp_obj[who][level] = []
            for el in obj[key]['what']:
                tmp_obj[who][level].append(el)


    #print(tmp_obj)
    with open('public/static/'+file+'.json', 'w') as outfile:
     json.dump(tmp_obj, outfile, indent=4, sort_keys=True)




if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Error! File to parse needed")
        sys.exit(0);
    main(sys.argv[1])
