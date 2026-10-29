import csv, sqlite3
con=sqlite3.connect('telecom.db'); con.execute('DROP TABLE IF EXISTS subscribers')
cols=['month','grameenphone','robi','banglalink','teletalk','total_mobile','mobile_internet','fixed_internet','total_internet','precision','source']
con.execute('CREATE TABLE subscribers (month TEXT PRIMARY KEY, grameenphone REAL, robi REAL, banglalink REAL, teletalk REAL, total_mobile REAL, mobile_internet REAL, fixed_internet REAL, total_internet REAL, precision REAL, source TEXT)')
for r in csv.DictReader(open('subscribers.csv')):
    con.execute('INSERT INTO subscribers VALUES (%s)'%','.join('?'*len(cols)),[(r[c] if c in('month','source') else (float(r[c]) if r[c] else None)) for c in cols])
con.commit()
out=[]
for q in [x for x in open('analysis.sql').read().split(';') if 'SELECT' in x]:
    title=[l for l in q.strip().split('\n') if l.startswith('--')][-1]
    cur=con.execute(q); names=[d[0] for d in cur.description]
    out+= [title,' | '.join(names)]+[' | '.join('' if v is None else str(v) for v in r) for r in cur.fetchall()]+['']
open('results.txt','w').write('\n'.join(out)); print('\n'.join(out))
