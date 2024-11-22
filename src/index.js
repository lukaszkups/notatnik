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
    padding: 10px 15px;
    margin-bottom: 5px;
    border-radius: 5px;
    background-color: #fdfdfd;
    color: #111;
    transition: transform 0.25s;
  	transform: translateY(0);
  }
  .notatnik-item:hover {
  	transform: translateY(-3px);
    transition: transform 0.25s;
  }
  .notatnik-item .date {
  	font-size: 0.75em;
  }
  .notatnik-item .content {
  	padding: 0 0 5px 0;
    font-size: 1em;
  }
  .notatnik-item a {
  	display: block;
    padding-bottom: 10px;
  }
  @keyframes dots {
    0%, 20% {
      content: '.';
    }
    40% {
      content: '..';
    }
    60% {
      content: '...';
    }
    90%, 100% {
      content: '';
    }
  }
  .notatnik-loader span:before {
    animation: dots 2s linear infinite;
    content: '';
  }
`;

function defaultRenderItem(item) {
  let template = `
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

function defaultRenderLoading(nodeId) {
	const wrapperNode = document.getElementById(nodeId);
  if (wrapperNode) {
  	wrapperNode.innerHTML = '<div class="notatnik-loader">Loading MicroBlog entries<span></span></div>'
  } else {
    console.error('NodeId has not been found: ', nodeId);  
  }
}

async function notatnik(opts) {
  const { 
    nodeId, 
    url,
    primaryColor = '#ecbd29',  
    primaryColorHover = '#ddb125',
    renderItem = defaultRenderItem,
    renderLoading = defaultRenderLoading,
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
    return parsedData;
  }

  function parseTextEntry(data) {
    const itemPropsArr = data.split(' ;; ');
    const item = {};
    itemPropsArr.forEach((propValue, index) => {
      // Not using one liner to support more features maybe in the future
      if (index === tagsIndex) {
        item[itemProps[index]] = propValue.split(' ');
      } else if (propValue) {
        item[itemProps[index]] = propValue;
      }
    });
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
  
  function renderItems(items) {
  	let htmlLayout = '<ul class="notatnik-list">';
  	items.forEach((item) => {
    	if (item?.content && item?.date) {
	    	htmlLayout += renderItem(item);    
      }
    });
    htmlLayout += '</ul>';
    
    const wrapperNode = document.getElementById(nodeId);
    if (wrapperNode) {
    	wrapperNode.innerHTML = htmlLayout;
    } else {
    	console.error('NodeId has not been found: ', nodeId);
    }
  }

  injectStyles();
  defaultRenderLoading(nodeId);
  const items = await getLatestEntries();
  renderItems(items);
}

notatnik({
	nodeId: 'bla',
	url: 'https://raw.githubusercontent.com/lukaszkups/microblog/refs/heads/main',
})