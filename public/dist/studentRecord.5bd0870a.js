let e;const t=document.querySelector(".drop-zone"),a=t.querySelector(".file-input"),n=document.querySelector(".form-text"),s=document.querySelector(".fa-cloud-arrow-up"),r=document.querySelector(".ongoing"),o=document.querySelector(".file-name"),l=document.querySelector(".size"),d=document.querySelector(".fa-spinner"),c=document.querySelector(".fa-square-check"),i=document.querySelector(".drag-drop-container"),p=document.querySelector(".student-record-container"),u=document.querySelectorAll(".page"),m=document.querySelector(".next"),v=document.querySelector(".prev"),f=document.querySelector(".main");t.addEventListener("click",()=>{a.click()}),a.onchange=({target:e})=>{S(e.files[0])},t.addEventListener("dragover",e=>{e.preventDefault(),s.classList.add("uploading"),n.textContent="Drop the file"}),t.addEventListener("dragleave",()=>{s.classList.remove("uploading"),n.textContent="Browse File to Upload"}),t.addEventListener("drop",e=>{e.preventDefault(),s.classList.remove("uploading"),n.textContent="Browse File to Upload";let t=e.dataTransfer.files;t.length>0&&S(t[0])});const S=e=>{e&&(r.classList.add("active"),o.textContent=`${e.name} \u{2022} Uploading`,d.classList.remove("remove")),y(e)},y=async e=>{let t=new FormData;t.append("file",e);try{let a=await fetch("/app/api/upload",{method:"POST",body:t});if(a.ok)await a.json(),o.textContent=`${e.name} \u{2022} Uploaded`,l.textContent=`${Math.round(e.size/1024)} KB`,c.classList.remove("remove"),d.classList.add("remove"),setTimeout(()=>{i.classList.add("remove"),f.classList.remove("blurred"),g(1)},3e3);else throw Error("There was an error uploading the file.")}catch(t){o.textContent=`${e.name} \u{2022} Error`,console.error(t)}},L=e=>`
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
        <p>Date enrolled: <span class="date-enrolled">${e.isEnrolledAt}</span></p>
    </div>`,g=async(t=1)=>{try{let a=await fetch(`/app/api/getAllStudents?page=${t}`);if(!a.ok)throw Error(a.message);let n=await a.json();n.totalStudents||(i.classList.remove("remove"),f.classList.add("blurred"));let s=n.data;e=n.pages,s.forEach(e=>{let t=L(e);p.insertAdjacentHTML("beforeend",t)})}catch(e){console.error(e)}};let E=1,h=3,q=1;const $=()=>{u.forEach((e,t)=>{e.textContent=E+t,e.dataset.page=E+t}),v.disabled=1===E,m.disabled=h===e,g(q)};u.forEach(t=>{t.addEventListener("click",t=>{(q=parseInt(t.target.dataset.page))===h&&h<e?(E++,h++):q===E&&E>1&&(E--,h--),$()})}),v.addEventListener("click",()=>{E>1&&(E--,q--,h--),$()}),m.addEventListener("click",()=>{h<e&&(E++,q++,h++),$()}),g(),$();
//# sourceMappingURL=studentRecord.5bd0870a.js.map
