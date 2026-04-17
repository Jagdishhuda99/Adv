const API_BASE = "https://bcr-election-2026.vercel.app";

let searchInput = document.getElementById('searchInput');
let resultsArea = document.getElementById('resultsArea');

let lastResults = [];

// SEARCH
searchInput.addEventListener('input', function(){
  let q = this.value.trim();
  if(q.length < 2){
    resultsArea.innerHTML='';
    return;
  }
  doSearch(q);
});

function doSearch(q){
  resultsArea.innerHTML = "Loading...";

  fetch(API_BASE + "/api/search?q=" + encodeURIComponent(q))
  .then(res => res.json())
  .then(data => {
    lastResults = Array.isArray(data) ? data : [];
    renderResults();
  })
  .catch(()=>{
    resultsArea.innerHTML="Error loading";
  });
}

// RENDER
function renderResults(){
  if(lastResults.length === 0){
    resultsArea.innerHTML="No results";
    return;
  }

  let html="";
  lastResults.forEach((v,i)=>{
    html += `
      <button class="result-btn" onclick="openModal(${i})">
        <b>${v.name}</b><br>
        ${v.roll_number || ""}
      </button>
    `;
  });

  resultsArea.innerHTML = html;
}

// MODAL
function openModal(i){
  let v = lastResults[i];
  if(!v) return;

  let url = API_BASE + "/card/" + v.id;

  document.getElementById('modalBox').innerHTML = `
    <h2>${v.name}</h2>
    <p>${v.roll_number || '-'}</p>
    <img src="${url}" style="width:100%;border-radius:8px">
    <br><br>
    <button onclick="downloadCard('${url}')">Download</button>
  `;

  document.getElementById('modalOverlay').style.display="flex";
}

function closeModal(){
  document.getElementById('modalOverlay').style.display="none";
}

// DOWNLOAD
function downloadCard(url){
  fetch(url)
    .then(res => res.blob())
    .then(blob=>{
      let a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = "card.png";
      a.click();
    });
}