const views={
overview:{title:'Security overview',breadcrumb:'OVERVIEW',metrics:[['active-attack','Active attacks','2','Assets under investigation','#ef4444'],['exposure-graph','Exposure paths','7','Paths to investigate','#f59e0b'],['control-validation','Control pass rate','84%','Passed evaluated checks','#7c3aed'],['identity-access','Identity risks','15','Access findings to review','#2563eb']],priority:'Priority findings',rows:[['Exposed workload with privileged access','Critical','Identity'],['Cloud configuration requires review','High','Cloud'],['Endpoint coverage gap identified','Medium','Endpoint']],posture:'Security posture',score:84},
cloud:{title:'Cloud security',breadcrumb:'CLOUD SECURITY',metrics:[['cloud-security','Cloud scopes','3','Example subscriptions & accounts','#7c3aed'],['exposure-graph','Priority findings','12','Cloud findings to investigate','#ef4444'],['infrastructure-network','Affected assets','24','Assets in this example','#2563eb'],['control-validation','Assessment pass rate','78%','Passed evaluated checks','#059669']],priority:'Cloud findings',rows:[['Public access on a cloud workload','Critical','Azure'],['Overprivileged cloud role','High','AWS'],['Workload configuration gap','Medium','M365']],posture:'Cloud assessment',score:78},
controls:{title:'Security control validation',breadcrumb:'CONTROL VALIDATION',metrics:[['control-validation','Controls assessed','15','Security control categories','#7c3aed'],['security-posture','Passed tests','427','Passed evaluated checks','#059669'],['exposure-graph','Failed tests','173','Checks requiring attention','#ef4444'],['agent-health','Pass rate','71.2%','427 of 600 evaluated','#2563eb']],priority:'Control findings',rows:[['Web application protection gap','Critical','WAF'],['Endpoint detection check failed','High','EDR'],['Data protection policy needs review','Medium','DLP']],posture:'Control pass rate',score:71.2}
};
const tabs=[...document.querySelectorAll('[role="tab"]')];
const chartPaths=['M0 22 15 18 30 20 45 8 60 13 75 6 90 10 105 3 120 7','M0 20 15 12 30 17 45 4 60 9 75 6 90 13 105 8 120 3','M0 20 15 22 30 15 45 17 60 9 75 12 90 6 105 9 120 3','M0 22 15 21 30 18 45 21 60 12 75 15 90 7 105 10 120 4'];
function selectView(tab){
const view=views[tab.dataset.view];
tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;});
document.querySelector('#dash-panel').setAttribute('aria-labelledby',tab.id);
document.querySelector('#dash-title').textContent=view.title;
document.querySelector('#dash-breadcrumb').textContent=view.breadcrumb;
document.querySelector('#metrics').innerHTML=view.metrics.map(([icon,label,value,note,color],index)=>`<article class="metric" style="--chart-color:${color}"><div class="metric-head"><img src="/assets/module-icons/${icon}.svg" width="31" height="31" alt=""><span class="metric-label">${label}</span></div><div class="metric-value">${value}</div><p class="metric-note">${note}</p><svg class="metric-chart" viewBox="0 0 120 28" preserveAspectRatio="none" aria-hidden="true"><path d="${chartPaths[index]}"/></svg><div class="metric-trend"><span class="trend-dot"></span> Illustrative assessment</div></article>`).join('');
document.querySelector('#priority-title').textContent=view.priority;
document.querySelector('#finding-rows').innerHTML=view.rows.map(([finding,severity,area])=>`<div class="finding-row"><span class="finding-name"><i class="${severity.toLowerCase()}"></i>${finding}</span><span class="severity ${severity.toLowerCase()}">${severity}</span><span class="finding-area">${area}</span></div>`).join('');
document.querySelector('#posture-title').textContent=view.posture;
document.querySelector('#posture-value').innerHTML=`${view.score}<span>%</span>`;
document.querySelector('.ring-value').style.strokeDashoffset=String(358.14*(1-view.score/100));
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectView(tab));tab.addEventListener('keydown',event=>{let next;const vertical=document.querySelector('[role="tablist"]').getAttribute('aria-orientation')==='vertical';if(event.key===(vertical?'ArrowDown':'ArrowRight'))next=(index+1)%tabs.length;if(event.key===(vertical?'ArrowUp':'ArrowLeft'))next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectView(tabs[next]);tabs[next].focus();}});});
const layoutQuery=window.matchMedia('(max-width:800px)');
function setTabOrientation(){document.querySelector('[role="tablist"]').setAttribute('aria-orientation',layoutQuery.matches?'horizontal':'vertical');}
layoutQuery.addEventListener('change',setTabOrientation);setTabOrientation();selectView(tabs[0]);
const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('#main-nav');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');nav.classList.remove('is-open');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('is-open',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!nav.contains(event.target)&&!menuButton.contains(event.target))closeMenu();});
window.matchMedia('(min-width:601px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
document.querySelector('#year').textContent=String(new Date().getFullYear());
