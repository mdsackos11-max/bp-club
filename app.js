const rankings = [
  {rank:1,name:"Carter",title:"Appeal Prince",change:1,photo:"assets/carter.jpeg"},
  {rank:2,name:"Max",title:"Hummble mogger",change:-1,photo:"assets/max.jpeg"},
  {rank:3,name:"Calan",title:"Psl apex",change:8,photo:"assets/calan.jpeg"},
  {rank:4,name:"Ryder",title:"the elite gooner",change:5,photo:"assets/ryder.jpeg"},
  {rank:5,name:"Jacob",title:"foid slayer",change:-2,photo:"assets/jacob.jpeg"},,
  {rank:6,name:"Your #6 Person",title:"Veteran",change:3},
  {rank:7,name:"Your #7 Person",title:"New Entry",change:12},
  {rank:8,name:"Your #8 Person",title:"Community Pick",change:-4},
  {rank:9,name:"Your #9 Person",title:"Standout",change:2},
  {rank:10,name:"Your #10 Person",title:"Top Member",change:0},
  {rank:11,name:"Your #11 Person",title:"Contender",change:-3},
  {rank:12,name:"Your #12 Person",title:"Rising Star",change:14}
];

const hall = [
  {name:"Legend One",title:"All-Time Great"},
  {name:"Legend Two",title:"Original Icon"},
  {name:"Legend Three",title:"Hall of Fame Favorite"}
];

const placeholder = (name, photo) => {
  if(photo) return `<img class="photo" src="${photo}" alt="${name}">`;
  const initials = name.split(" ").map(x => x[0]).slice(0,2).join("");
  return `<div class="photo placeholder">${initials}</div>`;
};

function changeBadge(change){
  if(change > 0) return `<span class="movement-change up">↗ +${change}</span>`;
  if(change < 0) return `<span class="movement-change down">↘ ${change}</span>`;
  return `<span class="movement-change">—</span>`;
}

function renderMovement(){
  const risers = [...rankings].filter(x=>x.change>0).sort((a,b)=>b.change-a.change).slice(0,2);
  const drops = [...rankings].filter(x=>x.change<0).sort((a,b)=>a.change-b.change).slice(0,2);
  document.querySelector("#risers").innerHTML = risers.map(x =>
    `<div class="movement-row"><div><span class="movement-rank">#${x.rank}</span><span class="movement-name">${x.name}</span></div>${changeBadge(x.change)}</div>`
  ).join("");
  document.querySelector("#drops").innerHTML = drops.map(x =>
    `<div class="movement-row"><div><span class="movement-rank">#${x.rank}</span><span class="movement-name">${x.name}</span></div>${changeBadge(x.change)}</div>`
  ).join("");
}

function renderRankings(){
  const q = document.querySelector("#search").value.toLowerCase().trim();
  const sort = document.querySelector("#sort").value;
  let data = rankings.filter(x => `${x.name} ${x.title}`.toLowerCase().includes(q));
  if(sort==="rise") data.sort((a,b)=>b.change-a.change);
  if(sort==="drop") data.sort((a,b)=>a.change-b.change);
  if(sort==="name") data.sort((a,b)=>a.name.localeCompare(b.name));
  if(sort==="rank") data.sort((a,b)=>a.rank-b.rank);

  document.querySelector("#rankingList").innerHTML = data.map(x => `
    <article class="rank-card" data-rank="${x.rank}">
      <div class="rank-number">${x.rank}</div>
      ${placeholder(x.name, x.photo)}
      <div>
        <div class="person-name">${x.name} <span>${x.rank===1?"Current Champion":""}</span></div>
        <div class="person-title">${x.title}</div>
      </div>
      <div class="rank-change">${changeBadge(x.change)}</div>
      <div class="rank-arrow">›</div>
    </article>
  `).join("");

  document.querySelectorAll(".rank-card").forEach(card=>{
    card.addEventListener("click",()=>openProfile(Number(card.dataset.rank)));
  });
}

function renderHall(){
  document.querySelector("#hallList").innerHTML = hall.map(x=>`
    <article class="hall-card">
      ${placeholder(x.name, x.photo)}
      <h3>${x.name}</h3>
      <p>${x.title}</p>
    </article>
  `).join("");
}

function openProfile(rank){
  const x = rankings.find(r=>r.rank===rank);
  const modal = document.querySelector("#profileModal");
  document.querySelector("#modalContent").innerHTML = `
    <div class="modal-profile">
      ${placeholder(x.name, x.photo)}
      <div><div class="section-kicker">RANK #${x.rank}</div><h2>${x.name}</h2><p>${x.title}</p></div>
    </div>
    <div class="stats">
      <div class="stat"><strong>#${x.rank}</strong><span>CURRENT RANK</span></div>
      <div class="stat"><strong>${x.change>0?"+":""}${x.change}</strong><span>LAST UPDATE</span></div>
      <div class="stat"><strong>—</strong><span>SCORE</span></div>
    </div>
  `;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
}

document.querySelector("#search").addEventListener("input",renderRankings);
document.querySelector("#sort").addEventListener("change",renderRankings);
document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",()=>{
  document.querySelector("#profileModal").classList.remove("open");
  document.querySelector("#profileModal").setAttribute("aria-hidden","true");
}));

// Set this to your next update time.
const nextUpdate = new Date(Date.now() + 3*24*60*60*1000 + 7*60*60*1000);

function tick(){
  let ms = Math.max(0,nextUpdate - new Date());
  const days = Math.floor(ms/86400000); ms%=86400000;
  const hours = Math.floor(ms/3600000); ms%=3600000;
  const mins = Math.floor(ms/60000); ms%=60000;
  const secs = Math.floor(ms/1000);
  document.querySelector("#days").textContent=String(days).padStart(2,"0");
  document.querySelector("#hours").textContent=String(hours).padStart(2,"0");
  document.querySelector("#mins").textContent=String(mins).padStart(2,"0");
  document.querySelector("#secs").textContent=String(secs).padStart(2,"0");
}
setInterval(tick,1000); tick();

renderMovement();
renderRankings();
renderHall();
