const root = document.querySelector('section.col-sm-12>.region.region-content')
const count = +document.querySelector('.pager-last>a').href.split('=')[1]+1

root.textContent = ''

const links = (new Array(count))
.fill(0)
.map((el,i)=>'https://hcj.gov.ua/offense?page='+i)

let main_arr = []
let err_arr = []

Promise.all(links.map(url =>
    fetch(url)
    .then(response => response.text())
    .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tr_arr = Array.from(doc.querySelectorAll('#block-system-main>div>div>div.view-content>div>table>tbody>tr'))
        try {
            const tmp_json_arr =
            tr_arr.map(tr=>({
                "№": tr.querySelector('.views-field-counter').textContent.trim(),
                "Прізвище, ім’я, по батькові судді": tr.querySelector('.views-field-title').textContent.trim(),
                "Назва суду": tr.querySelector('.views-field-field-court-name').textContent.trim(),
                "Дата прийняття рішення палатою / Дата рішення ВККСУ": tr.querySelector('.views-field-field-date').textContent.trim(),
                "Номер рішення палати / Номер рекомендації ВККСУ": tr.querySelector('.views-field-field-number').textContent.trim(),
                "Дата та номер рішення ВРП": tr.querySelector('.views-field-field-date-iso').textContent.trim()+'\n№ '+tr.querySelector('.views-field-field-number-1').textContent.trim(),
                "Дата рішення ВРП": tr.querySelector('.views-field-field-date-iso').textContent.trim(),
                "Номер рішення ВРП": tr.querySelector('.views-field-field-number-1').textContent.trim(),
                "Автор звернення": tr.querySelector('.views-field-field-complainant').textContent.trim(),
                "Доповідач": tr.querySelector('.views-field-field-narrator').textContent.trim(),
            }))
            main_arr = main_arr.concat(tmp_json_arr)
        }
        catch (err) {
            err_arr.push({link: url, html: tr_arr, error: err,})
        }
    })
)).then(data => {
    main_arr = main_arr.sort((a,b)=>a["№"]-b["№"])
    const json = JSON.stringify(main_arr, null, '\t')
    console.log(json)
    const pre = document.createElement('pre')
    root.appendChild(pre)
    pre.textContent = json
    download('offense', json);
})

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
