// Fonemas (AFI): [punto, modo, sonoridad]
const PH={p:["Bilabial","Oclusivo","Sordo"],t:["Dental/Alveolar","Oclusivo","Sordo"],b:["Bilabial","Oclusivo","Sonoro"],m:["Bilabial","Nasal","Sonoro"],s:["Alveolar","Fricativo","Sordo"],k:["Velar","Oclusivo","Sordo"],a:["Central","Baja","Sonoro"],i:["Anterior","Alta","Sonoro"],d:["Dental/Alveolar","Oclusivo","Sonoro"],g:["Velar","Oclusivo","Sonoro"],f:["Labiodental","Fricativo","Sordo"],"θ":["Interdental","Fricativo","Sordo"],"ʝ":["Palatal","Fricativo","Sonoro"],x:["Velar","Fricativo","Sordo"],"tʃ":["Postalveolar","Africado","Sordo"],n:["Alveolar","Nasal","Sonoro"],"ɲ":["Palatal","Nasal","Sonoro"],l:["Alveolar","Lateral","Sonoro"],"ʎ":["Palatal","Lateral","Sonoro"],"ɾ":["Alveolar","Vibrante simple","Sonoro"],r:["Alveolar","Vibrante múltiple","Sonoro"],e:["Anterior","Media","Sonoro"],o:["Posterior","Media","Sonoro"],u:["Posterior","Alta (cerrada)","Sonoro"]};
// Formato "pa[la]bra:fonema" -> el texto entre [ ] es la letra resaltada
const W=`[p]ato:p|so[p]a:p|[p]elota:p|ca[p]a:p|a[p]oyo:p|[p]uente:p|[p]iedra:p|lám[p]ara:p
[t]azón:t|[t]ierra:t|pa[t]o:t|me[t]a:t|[t]ren:t|ma[t]emática:t|[t]orre:t|bo[t]ón:t
[b]ota:b|[v]aca:b|[b]arco:b|[v]entana:b|lo[b]o:b|ár[b]ol:b|[b]ruja:b|[v]olcán:b
[m]esa:m|[m]ano:m|ca[m]a:m|[m]ontaña:m|lu[m]bre:m|[m]úsica:m|plu[m]a:m|[m]ar:m
[s]ol:s|ca[s]a:s|[s]illa:s|ma[s]a:s|pe[s]ca:s|[s]apo:s|ro[s]a:s
[k]ilo:k|[c]asa:k|[qu]eso:k|[c]ofre:k|ba[qu]e:k|[c]uchara:k|[qu]ién:k|[c]ulebra:k
[a]gua:a|[a]rbol:a|c[a]sa:a|m[a]no:a|[a]vión:a|l[a]go:a|[a]nillo:a|pl[a]ya:a
[i]sla:i|m[i]rar:i|[i]glesia:i|v[i]no:i|l[i]bro:i|[i]man:i|pap[i]l:i
[d]edo:d|[d]ado:d|ca[d]ena:d|[d]ulce:d|an[d]ar:d|[d]ragón:d|[d]ía:d|mun[d]o:d
[g]ato:g|[g]orra:g|[gu]itarra:g|[gu]erra:g|ti[g]re:g|[g]lobo:g|a[g]ua:g|a[g]ricultor:g
[f]oto:f|[f]uego:f|ca[f]é:f|[f]lor:f|e[f]ecto:f|[f]rutas:f|ele[f]ante:f|[f]amilia:f
[z]apato:θ|[c]ielo:θ|[z]orro:θ|a[z]úcar:θ|[c]ebolla:θ|lu[z]:θ|[z]umo:θ|ve[c]es:θ
[y]o:ʝ|ma[y]o:ʝ|pla[y]a:ʝ|a[y]uda:ʝ|[y]ema:ʝ|ra[y]o:ʝ|[y]ate:ʝ|po[y]o:ʝ
[j]amón:x|[g]ente:x|[j]irafa:x|ca[j]a:x|[g]eneral:x|mu[j]er:x|[j]uego:x|re[j]o:x
[ch]ico:tʃ|le[ch]e:tʃ|[ch]ocolate:tʃ|mu[ch]o:tʃ|co[ch]e:tʃ|[ch]ancla:tʃ|le[ch]uza:tʃ|ca[ch]orro:tʃ
[n]ube:n|[n]ariz:n|ca[n]a:n|[n]ido:n|pia[n]o:n|[n]oche:n|lu[n]a:n|[n]ave:n
[ñ]andú:ɲ|ni[ñ]o:ɲ|ma[ñ]ana:ɲ|pi[ñ]a:ɲ|ca[ñ]a:ɲ|[ñ]u:ɲ|ara[ñ]a:ɲ|se[ñ]or:ɲ
[l]una:l|[l]ápiz:l|pe[l]ota:l|so[l]:l|[l]eón:l|a[l]a:l|[l]ibro:l|ba[l]ón:l
[ll]uvia:ʎ|ca[ll]e:ʎ|po[ll]o:ʎ|[ll]ama:ʎ|casti[ll]o:ʎ|[ll]ave:ʎ|ga[ll]ina:ʎ|si[ll]a:ʎ
pa[r]o:ɾ|ca[r]a:ɾ|mi[r]ar:ɾ|pe[r]a:ɾ|co[r]azón:ɾ|a[r]ena:ɾ|to[r]o:ɾ|p[r]ado:ɾ
[r]osa:r|pe[rr]o:r|ca[rr]o:r|[r]atón:r|gue[rr]a:r|[r]ío:r|to[rr]e:r
[e]scuela:e|m[e]sa:e|[e]lefante:e|p[e]lo:e|l[e]che:e|[e]strella:e|v[e]ntana:e|t[e]cho:e
[o]so:o|l[o]bo:o|[o]jo:o|m[o]nte:o|c[o]co:o|[o]nda:o|s[o]l:o|p[o]rtón:o
[u]va:u|l[u]na:u|[u]ña:u|n[u]be:u|c[u]na:u|[u]nión:u|s[u]r:u|j[u]go:u`.split(/[\n|]/).map(s=>{const[w,p]=s.split(":");return{w,p}});

// Resonancia (oral/nasal, no "bucal") y criterio acústico, según el cuadro
(()=>{const NAS=['m','n','ɲ'],GRA=['p','b','m','k','a','g','x','o','u'];for(const k in PH)PH[k].push(NAS.includes(k)?'Nasal':'Oral',GRA.includes(k)?'Grave':'Agudo')})();
