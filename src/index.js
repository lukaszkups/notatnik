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
`

function renderItem(item) {
  return `
    <li class="notatnik-item">
      <p>${item.content}</p>
      <a href="${item.link}">${item.link}</a>
    </li>
  `;
}

async function notatnik(opts) {
  const { 
    nodeId, 
    url,
    primaryColor = '#ecbd29',  
    primaryColorHover = '#ddb125',
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

  await getLatestEntries();
}