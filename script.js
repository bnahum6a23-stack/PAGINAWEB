// Tabla de codones (ARN → aminoácidos)
const CODON_TABLE = {
  'UUU':'Phe','UUC':'Phe','UUA':'Leu','UUG':'Leu',
  'UCU':'Ser','UCC':'Ser','UCA':'Ser','UCG':'Ser',
  'UAU':'Tyr','UAC':'Tyr','UAA':'STOP','UAG':'STOP',
  'UGU':'Cys','UGC':'Cys','UGA':'STOP','UGG':'Trp',

  'CUU':'Leu','CUC':'Leu','CUA':'Leu','CUG':'Leu',
  'CCU':'Pro','CCC':'Pro','CCA':'Pro','CCG':'Pro',
  'CAU':'His','CAC':'His','CAA':'Gln','CAG':'Gln',
  'CGU':'Arg','CGC':'Arg','CGA':'Arg','CGG':'Arg',

  'AUU':'Ile','AUC':'Ile','AUA':'Ile','AUG':'Met',
  'ACU':'Thr','ACC':'Thr','ACA':'Thr','ACG':'Thr',
  'AAU':'Asn','AAC':'Asn','AAA':'Lys','AAG':'Lys',
  'AGU':'Ser','AGC':'Ser','AGA':'Arg','AGG':'Arg',

  'GUU':'Val','GUC':'Val','GUA':'Val','GUG':'Val',
  'GCU':'Ala','GCC':'Ala','GCA':'Ala','GCG':'Ala',
  'GAU':'Asp','GAC':'Asp','GAA':'Glu','GAG':'Glu',
  'GGU':'Gly','GGC':'Gly','GGA':'Gly','GGG':'Gly'
};

// Helpers
function cleanDNA(s){ return s.toUpperCase().replace(/[^ATCG]/g,''); }
function complementDNA(s){
  const map = {A:'T',T:'A',C:'G',G:'C'};
  return s.split('').map(x=>map[x]||'').join('');
}
function transcribe(dna){ return dna.replace(/T/g,'U'); }
function translateRNA(rna){
  let aa=[];
  for(let i=0;i+2<rna.length;i+=3){
    const codon = rna.slice(i, i+3);
    const aa3 = CODON_TABLE[codon] || "---";
    if(aa3==="STOP"){ aa.push("STOP"); break; }
    aa.push(aa3);
  }
  return aa.join("-");
}

// UI buttons
document.getElementById("runBtn").addEventListener("click", ()=>{
  const raw = document.getElementById("dnaInput").value;
  const dna = cleanDNA(raw);
  if(dna.length===0){ alert("Escribe ADN válido (A,T,C,G)."); return; }

  const rep = complementDNA(dna);
  const rna = transcribe(dna);
  const aa = translateRNA(rna);

  document.getElementById("repOutput").textContent = rep;
  document.getElementById("rnaOutput").textContent = rna;
  document.getElementById("aaOutput").textContent = aa;
});

document.getElementById("clearBtn").addEventListener("click", ()=>{
  document.getElementById("dnaInput").value="";
  document.getElementById("repOutput").textContent="";
  document.getElementById("rnaOutput").textContent="";
  document.getElementById("aaOutput").textContent="";
});


// Mini-quiz
const QUIZ = [
  {q:'¿Qué base sustituye la timina (T) en el ARN?', choices:['Adenina','Uracilo','Guanina'], a:1},
  {q:'¿Cuál es el codón de inicio estándar?', choices:['UAG','AUG','UGA'], a:1},
  {q:'Proceso ADN → ARN:', choices:['Traducción','Replicación','Transcripción'], a:2},
  {q:'¿Cuántos nucleótidos tiene un codón?', choices:['2','3','4'], a:1},
  {q:'¿Qué NO hace el ARNt?', choices:['Llevar aminoácidos','Formar ribosoma','Reconocer codones'], a:1}
];

const quizDiv = document.getElementById("quiz");

QUIZ.forEach((item, idx)=>{
  const box = document.createElement("div");
  box.style.marginBottom="10px";

  const qText = document.createElement("div");
  qText.textContent = (idx+1)+". "+item.q;
  box.appendChild(qText);

  item.choices.forEach((c,i)=>{
    const label = document.createElement("label");
    const id = "q"+idx+"c"+i;

    const radio = document.createElement("input");
    radio.type="radio";
    radio.name="q"+idx;
    radio.value=i;

    label.appendChild(radio);
    label.append(" "+c);

    label.style.display="block";
    box.appendChild(label);
  });

  const btn = document.createElement("button");
  btn.textContent="Comprobar";
  btn.style.marginTop="6px";

  btn.onclick=()=>{
    const sel = box.querySelector("input[type=radio]:checked");
    if(!sel){ alert("Selecciona una opción"); return; }

    const isCorrect = Number(sel.value) === item.a;

    alert(isCorrect ? "✔ Correcto" : "✘ Incorrecto. Respuesta correcta: "+item.choices[item.a]);
  };

  box.appendChild(btn);
  quizDiv.appendChild(box);
});
