let e;const t=document.querySelector(".drop-zone"),r=t.querySelector(".file-input"),a=document.querySelector(".form-text"),n=document.querySelector(".fa-cloud-arrow-up"),s=document.querySelector(".ongoing"),o=document.querySelector(".file-name"),l=document.querySelector(".size"),c=document.querySelector(".fa-spinner"),d=document.querySelector(".fa-square-check"),i=document.querySelector(".drag-drop-container"),u=document.querySelector(".student-record-container"),p=document.querySelectorAll(".page"),m=document.querySelector(".next"),v=document.querySelector(".prev"),f=document.querySelector(".main"),L=document.querySelector(".filter-container"),y=document.querySelector(".delete-btn");t.addEventListener("click",()=>{r.click()}),r.onchange=({target:e})=>{E(e.files[0])},t.addEventListener("dragover",e=>{e.preventDefault(),n.classList.add("uploading"),a.textContent="Drop the file"}),t.addEventListener("dragleave",()=>{n.classList.remove("uploading"),a.textContent="Browse File to Upload"}),t.addEventListener("drop",e=>{e.preventDefault(),n.classList.remove("uploading"),a.textContent="Browse File to Upload";let t=e.dataTransfer.files;t.length>0&&E(t[0])});const E=e=>{e&&(s.classList.add("active"),o.textContent=`${e.name} \u{2022} Uploading`,c.classList.remove("remove")),S(e)},S=async e=>{let t=new FormData;t.append("file",e);try{let r=await fetch("/app/api/upload",{method:"POST",body:t});if(r.ok)await r.json(),o.textContent=`${e.name} \u{2022} Uploaded`,l.textContent=`${Math.round(e.size/1024)} KB`,d.classList.remove("remove"),c.classList.add("remove"),setTimeout(()=>{i.classList.add("remove"),f.classList.remove("blurred"),b()},3e3);else throw Error("There was an error uploading the file.")}catch(t){o.textContent=`${e.name} \u{2022} Error`,console.error(t)}};let $="",g="",h="";L.addEventListener("submit",e=>{e.preventDefault();let t=Object.fromEntries(new FormData(L).entries());$=t.studentNumber?`studentNumber=${t.studentNumber}&`:"",g=t.yearLevel?`yearLevel=${t.yearLevel}&`:"",h=t.course?`course=${t.course}&`:"",b($,g,h)}),y.addEventListener("click",async e=>{e.preventDefault();try{let e=await fetch("/app/api/delete-record");if(!e.ok)throw Error("Failed to delete record");await e.json(),setTimeout(()=>i.classList.remove("remove"),2e3)}catch(e){console.error(e)}});const q=e=>`
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
    </div>`,b=async(t="",r="",a="",n=1)=>{try{u.innerHTML="";let s=await fetch(`/app/api/getAllStudents?${t}${r}${a}page=${n}`);if(!s.ok)throw Error(s.message);let o=await s.json();if(o.totalStudents){let t=o.data;e=o.pages,t.forEach(e=>{let t=q(e);u.insertAdjacentHTML("beforeend",t)})}else i.classList.remove("remove"),f.classList.add("blurred")}catch(e){console.error(e)}};let w=1,x=3,k=1;const C=()=>{p.forEach((e,t)=>{e.textContent=w+t,e.dataset.page=w+t}),v.disabled=1===w,m.disabled=x===e,b($,g,h,k)};p.forEach(t=>{t.addEventListener("click",t=>{(k=parseInt(t.target.dataset.page))===x&&x<e?(w++,x++):k===w&&w>1&&(w--,x--),C()})}),v.addEventListener("click",()=>{w>1&&(w--,k--,x--),C()}),m.addEventListener("click",()=>{x<e&&(w++,k++,x++),C()}),i.classList.contains("remove")&&b();
//# sourceMappingURL=studentRecord.7b84049e.js.map
