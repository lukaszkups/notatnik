const itemProps = [
  'date',
  'content',
  'tags',
  'link',
  'image'
]
const tagsIndex = itemProps.findIndex((txt) => txt === 'tags');

const defaultStyles = `
  .notatnik-list {
    display: block;
    position: relative;
    margin: 5px;
  }
  .notatnik-item {
    list-style-type: none;
    display: block;
    position: relative;
    box-sizing: border-box;
    padding: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
    backgroud-color: #fdfdfd;
    color: #111;
  }
`;

function renderItem(item) {
  const template = `
    <li class="notatnik-item">
      <div class="date">${item.date}</div>
      <div class="content">${item.content}</div>
  `;
  if (item.link) {
    template += `<a href="${item.link}">${item.link}</a>`;
  }
  if (item.image) {
    template += `<img src="${item.image}" alt="Micropost image" />`;
  }
  template += '</li>';
  return template;
}

async function notatnik(opts) {
  const { 
    nodeId, 
    url,
    primaryColor = '#ecbd29',  
    primaryColorHover = '#ddb125',
    renderItem = renderItem,
  } = opts;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  async function getLatestEntries() {
    return await getEntriesFrom(currentYear, currentMonth)
  }

  async function getEntriesFrom(year, month) {
    const response = await fetch(`${url}/${year}-${month}.txt`);
    if (!response.ok) {
      console.error('There was an error while fetching microblog entries: ', e);
      return [];
    }
    const data = await response.text();

    const parsedData = parseTextEntries(data);
    console.log(111111)
    console.log(parsedData)
    console.log(111111)
    return parsedData;
  }

  function parseTextEntry(data) {
    const itemPropsArr = data.split(' ;; ');
    const item = {};
    itemPropsArr.forEach((propValue, index) => {
      // Not using one liner to support more features maybe in the future
      if (index === tagsIndex) {
        item[itemProps[index]] = propValue.split(' ');
      } else {
        item[itemProps[index]] = propValue;
      }
    });
    console.log(3333, item)
    return item;
  }

  function parseTextEntries(data) {
    return data.split('\n').map((line) => parseTextEntry(line));
  }

  function injectStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = defaultStyles;
    document.head.appendChild(styleSheet)
  }

  injectStyles();
  await getLatestEntries();
}