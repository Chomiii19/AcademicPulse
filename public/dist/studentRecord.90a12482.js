let e;const t=document.querySelector(".drop-zone"),a=t.querySelector(".file-input"),n=document.querySelector(".form-text"),r=document.querySelector(".fa-cloud-arrow-up"),s=document.querySelector(".ongoing"),o=document.querySelector(".file-name"),l=document.querySelector(".size"),d=document.querySelector(".fa-spinner"),c=document.querySelector(".fa-square-check"),i=document.querySelector(".drag-drop-container"),u=document.querySelector(".student-record-container"),p=document.querySelectorAll(".page"),m=document.querySelector(".next"),v=document.querySelector(".prev"),f=document.querySelector(".main"),L=document.querySelector(".filter-container");t.addEventListener("click",()=>{a.click()}),a.onchange=({target:e})=>{y(e.files[0])},t.addEventListener("dragover",e=>{e.preventDefault(),r.classList.add("uploading"),n.textContent="Drop the file"}),t.addEventListener("dragleave",()=>{r.classList.remove("uploading"),n.textContent="Browse File to Upload"}),t.addEventListener("drop",e=>{e.preventDefault(),r.classList.remove("uploading"),n.textContent="Browse File to Upload";let t=e.dataTransfer.files;t.length>0&&y(t[0])});const y=e=>{e&&(s.classList.add("active"),o.textContent=`${e.name} \u{2022} Uploading`,d.classList.remove("remove")),S(e)},S=async e=>{let t=new FormData;t.append("file",e);try{let a=await fetch("/app/api/upload",{method:"POST",body:t});if(a.ok)await a.json(),o.textContent=`${e.name} \u{2022} Uploaded`,l.textContent=`${Math.round(e.size/1024)} KB`,c.classList.remove("remove"),d.classList.add("remove"),setTimeout(()=>{i.classList.add("remove"),f.classList.remove("blurred"),q()},3e3);else throw Error("There was an error uploading the file.")}catch(t){o.textContent=`${e.name} \u{2022} Error`,console.error(t)}};let E="",$="",g="";L.addEventListener("submit",e=>{e.preventDefault();let t=Object.fromEntries(new FormData(L).entries());t.studentNumber&&(E=`studentNumber=${t.studentNumber}&`),t.yearLevel&&($=`yearLevel=${t.yearLevel}&`),t.course&&(g=`course=${t.course}&`),q(E,$,g)});const h=e=>`
    <div class="student-record">
        <p>
            Student Number: <span class="studentNumber">${e.studentNumber}</span>
        </p>
        <div class="fullname">
            <p>Surname: <span class="surname">${e.surname}</span></p>
            <p>First name: <span class="firstname">${e.firstname}</span></p>
            <p>Middle name: <span class="middlename">${e.middlename||""}</span></p>
            <p>Extension: <span class="extension">${e.extension||""}</span></p>
        </div>

        <p>Course: <span class="course">${e.course}</span></p>
        <p>Year Level: <span class="course">${e.yearLevel}</span></p>
        <p>
            Email:
            <span class="email">${e.email}</span>
        </p>
        <p>Status: <span class="enrollStatus">${e.isEnrolled?"Enrolled":"Not Enrolled"}</span></p>
        <p>Date enrolled: <span class="date-enrolled">${e.isEnrolledAt?e.isEnrolledAt.split("T")[0]:""}</span></p>
    </div>`,q=async(t="",a="",n="",r=1)=>{try{u.innerHTML="";let s=await fetch(`/app/api/getAllStudents?${t}${a}${n}page=${r}`);if(!s.ok)throw Error(s.message);let o=await s.json();if(o.totalStudents){let t=o.data;e=o.pages,t.forEach(e=>{let t=h(e);u.insertAdjacentHTML("beforeend",t)})}else i.classList.remove("remove"),f.classList.add("blurred")}catch(e){console.error(e)}};let b=1,x=3,w=1;const C=()=>{p.forEach((e,t)=>{e.textContent=b+t,e.dataset.page=b+t}),v.disabled=1===b,m.disabled=x===e,q(E,$,g,w)};p.forEach(t=>{t.addEventListener("click",t=>{(w=parseInt(t.target.dataset.page))===x&&x<e?(b++,x++):w===b&&b>1&&(b--,x--),C()})}),v.addEventListener("click",()=>{b>1&&(b--,w--,x--),C()}),m.addEventListener("click",()=>{x<e&&(b++,w++,x++),C()}),i.classList.contains("remove")&&q();
//# sourceMappingURL=studentRecord.90a12482.js.map
