let e;const t=document.querySelector(".drop-zone"),a=t.querySelector(".file-input"),r=document.querySelector(".form-text"),s=document.querySelector(".fa-cloud-arrow-up"),n=document.querySelector(".ongoing"),o=document.querySelector(".file-name"),l=document.querySelector(".size"),d=document.querySelector(".fa-spinner"),c=document.querySelector(".fa-square-check"),i=document.querySelector(".drag-drop-container"),u=document.querySelector(".student-record-container"),p=document.querySelectorAll(".page"),m=document.querySelector(".next"),v=document.querySelector(".prev"),f=document.querySelector(".main"),L=document.querySelector(".filter-container"),y=document.querySelector(".delete-btn");t.addEventListener("click",()=>{a.click()}),a.onchange=({target:e})=>{E(e.files[0])},t.addEventListener("dragover",e=>{e.preventDefault(),s.classList.add("uploading"),r.textContent="Drop the file"}),t.addEventListener("dragleave",()=>{s.classList.remove("uploading"),r.textContent="Browse File to Upload"}),t.addEventListener("drop",e=>{e.preventDefault(),s.classList.remove("uploading"),r.textContent="Browse File to Upload";let t=e.dataTransfer.files;t.length>0&&E(t[0])});const E=e=>{e&&(n.classList.add("active"),o.textContent=`${e.name} \u{2022} Uploading`,d.classList.remove("remove")),S(e)},S=async e=>{let t=new FormData;t.append("file",e);try{let a=await fetch("/app/api/upload",{method:"POST",body:t});if(a.ok)await a.json(),o.textContent=`${e.name} \u{2022} Uploaded`,l.textContent=`${Math.round(e.size/1024)} KB`,c.classList.remove("remove"),d.classList.add("remove"),setTimeout(()=>{i.classList.add("remove"),f.classList.remove("blurred"),C()},3e3);else throw Error("There was an error uploading the file.")}catch(t){o.textContent=`${e.name} \u{2022} Error`,console.error(t)}};let g="",h="",$="";L.addEventListener("submit",e=>{e.preventDefault();let t=Object.fromEntries(new FormData(L).entries());g=t.studentNumber?`studentNumber=${t.studentNumber}&`:"",h=t.yearLevel?`yearLevel=${t.yearLevel}&`:"",$=t.course?`course=${t.course}&`:"",b(g,h,$)}),y.addEventListener("click",async e=>{e.preventDefault();try{let e=await fetch("/app/api/delete-record");if(!e.ok)throw Error("Failed to delete record");await e.json(),setTimeout(()=>{w=1,x=3,k=1,f.classList.add("blurred"),i.classList.remove("remove")},2e3)}catch(e){console.error(e)}});const q=e=>`
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
    </div>`,b=async(t="",a="",r="",s=1)=>{try{u.innerHTML="";let n=await fetch(`/app/api/getAllStudents?${t}${a}${r}page=${s}`);if(!n.ok)throw Error(n.message);let o=await n.json();if(o.totalStudents){let t=o.data;e=o.pages,t.forEach(e=>{let t=q(e);u.insertAdjacentHTML("beforeend",t)})}else i.classList.remove("remove"),f.classList.add("blurred")}catch(e){console.error(e)}};let w=1,x=3,k=1;const C=()=>{p.forEach((e,t)=>{e.textContent=w+t,e.dataset.page=w+t}),v.disabled=1===w,m.disabled=x===e,b(g,h,$,k)};p.forEach(t=>{t.addEventListener("click",t=>{k=parseInt(t.target.dataset.page),p.forEach(e=>e.classList.remove("active-page"));let a=[...p].find(e=>parseInt(e.dataset.page)===k);a&&a.classList.add("active-page"),k===x&&x<e?(w++,x++):k===w&&w>1&&(w--,x--),C()})}),v.addEventListener("click",()=>{w>1&&(w--,k--,x--),C()}),m.addEventListener("click",()=>{x<e&&(w++,k++,x++),C()}),i.classList.contains("remove")?b():f.classList.add("blurred");
//# sourceMappingURL=studentRecord.2de2a46e.js.map
