var root = document.querySelector('section.col-sm-12>.region.region-content')
var count = +document.querySelector('.pager-last>a').href.split('=')[1]

root.textContent = ''

var links = (new Array(count))
.fill(0)
.map((el,i)=>'https://hcj.gov.ua/intervention?page='+i)

var main_arr = []

Promise.all(links.map(url =>
    fetch(url)
    .then(response => response.text())
    .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tr_arr = Array.from(doc.querySelectorAll('#block-system-main>div>div>div.view-content>div>table>tbody>tr'))
        const tmp_json_arr =
        tr_arr.map(tr=>({
            "№": tr.querySelector('.views-field-counter').textContent.trim(),
            "Дата надходження": tr.querySelector('.views-field-field-date').textContent.trim(),
            "Справа № / документ": tr.querySelector('.views-field-field-number').textContent.trim(),
            "Прізвище, ім’я, по батькові судді": tr.querySelector('.views-field-title').textContent.trim(),
            "Назва суду": tr.querySelector('.views-field-field-court-name').textContent.trim(),
            "Результат перевірки - рішення ВРП": tr.querySelector('.views-field-field-number-1').textContent.trim(),
            "Реагування на рішення ВРП": tr.querySelector('.views-field-field-penalty').textContent.trim(),
            "Автор звернення": tr.querySelector('.views-field-field-narrator').textContent.trim(),
            "Доповідач": tr.querySelector('.views-field-field-note').textContent.trim(),
        }))
        main_arr = main_arr.concat(tmp_json_arr)
    })
)).then(data => {
    main_arr = main_arr.sort((a,b)=>a["№"]-b["№"])
    console.log(JSON.stringify(main_arr, null, '\t'))
})
