const revealObserver = new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const menu=document.querySelector('.menu');
const nav=document.querySelector('header nav');
menu?.addEventListener('click',()=>nav?.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

document.querySelectorAll('[href="#contact"]').forEach(a=>a.addEventListener('click',()=>{}));

const cases={
 stroy:{
   type:'WEB · E-COMMERCE',
   title:'СТРОЙДВОР',
   text:'Полноценный интернет-магазин строительных материалов, созданный под реальные задачи бизнеса.',
   task:'Создать удобную витрину и рабочую систему для каталога товаров и обработки заказов.',
   done:'Каталог, поиск, корзина, оформление заказа, административная часть, база данных и развёртывание на сервере.',
   tags:['Node.js','Express','MongoDB','Nginx'],
   gallery:['assets/stroy-01.png','assets/stroy-02.png','assets/stroy-03.png','assets/stroy-04.png','assets/stroy-05.png','assets/stroy-06.png','assets/stroy-07.png','assets/stroy-08.png','assets/stroy-09.png','assets/stroy-10.png','assets/stroy-11.png']
 },
 vkcrm:{
   type:'VK · CRM · API',
   title:'CRM',
   text:'Система обработки заявок из VK, собранная для единой работы с входящими обращениями.',
   task:'Автоматизировать получение заявок из VK и дать администратору удобное место для их обработки.',
   done:'Получение данных из VK, серверная обработка, сохранение заявок, CRM-панель и уведомления.',
   tags:['VK API','Node.js','MongoDB','REST API'],
   gallery:['assets/crm-01.png', 'assets/crm-02.png', 'assets/crm-03.png', 'assets/crm-04.png', 'assets/crm-05.png', 'assets/crm-06.png', 'assets/crm-07.png', 'assets/crm-08.png', 'assets/crm-09.png', 'assets/crm-10.png', 'assets/crm-11.png', 'assets/crm-12.png', 'assets/crm-13.png', 'assets/crm-14.png']
 }
};
const modal=document.getElementById('caseModal');
const openCase=(key)=>{const c=cases[key];if(!c||!modal)return;document.getElementById('modalType').textContent=c.type;document.getElementById('modalTitle').textContent=c.title;document.getElementById('modalText').textContent=c.text;document.getElementById('modalTask').textContent=c.task;document.getElementById('modalDone').textContent=c.done;document.getElementById('modalTags').innerHTML=c.tags.map(x=>`<i>${x}</i>`).join('');const gallery=document.getElementById('caseGallery');gallery.innerHTML=(c.gallery||[]).map((src,i)=>`<figure><img src="${src}" alt="СТРОЙДВОР — скриншот ${i+1}" loading="lazy"></figure>`).join('');modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
const closeCase=()=>{modal?.classList.remove('is-open');modal?.setAttribute('aria-hidden','true');document.body.style.overflow=''};
document.querySelectorAll('.case-btn').forEach(b=>b.addEventListener('click',()=>openCase(b.dataset.case)));
document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',closeCase));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCase()});

document.querySelectorAll('[data-telegram]').forEach(a=>a.addEventListener('click',e=>{if(window.PORTFOLIO?.telegram && window.PORTFOLIO.telegram!=='#') a.href=window.PORTFOLIO.telegram; else {e.preventDefault();alert('Добавь ссылку на Telegram в config.js');}}));
if(window.PORTFOLIO){
 document.querySelectorAll('a[href="mailto:hello@example.com"]').forEach(a=>a.href='mailto:'+window.PORTFOLIO.email);
}

const leadForm=document.getElementById('leadForm');
if(leadForm){
  leadForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const status=document.getElementById('formStatus');
    const data=Object.fromEntries(new FormData(leadForm).entries());
    const endpoint=(window.SASHA_CONFIG&&window.SASHA_CONFIG.leadEndpoint)||'/api/lead';
    status.textContent='Отправляем заявку…';
    if(endpoint){
      try{
        const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
        if(!r.ok) throw new Error('request failed');
        leadForm.reset(); status.textContent='Заявка отправлена. Спасибо!';
      }catch(err){status.textContent='Не удалось отправить автоматически. Напишите напрямую через контакты ниже.';}
    }else{
      const subject=encodeURIComponent('Заявка с ALEXANDER.DEV — '+data.name);
      const body=encodeURIComponent('Имя: '+data.name+'\nКонтакт: '+data.contact+'\n\nЗадача:\n'+data.message);
      const email=(window.SASHA_CONFIG&&window.SASHA_CONFIG.email)||'';
      if(email){window.location.href='mailto:'+email+'?subject='+subject+'&body='+body; status.textContent='Открываем почтовое приложение…';}
      else{status.textContent='Форма готова. Подключите leadEndpoint или email в config.js.';}
    }
  });
}
