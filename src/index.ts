import * as puppeteer from 'puppeteer';

type Article = {
  link?: string;
  title?: string;
  description?: string;
  mainImageUrl?: string;
  avatarImageUrl?: string;
  editor?: string;
}

const initBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  })
  return browser
}

(async () => {
  const browser = await initBrowser()
  const page = await browser.newPage()

  await page.goto('https://www.medium.com/tag/react/recommended')

  const articles = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      'article h2, article h3, article div.h > img, article div.l > img, article div.ht > div > div.bl > a > p, article div.l.er.ib > a:nth-child(1)'
    )
    const titleEl = document.querySelectorAll('article h2')
    const descriptionEl = document.querySelectorAll('article h3')
    const mainImageUrlEl = document.querySelectorAll('article div.h > img')
    const avatarImageUrlEl = document.querySelectorAll('article div.l > img')
    const editorEl = document.querySelectorAll('article div.ht > div > div.bl > a > p')
    const linkEl = document.querySelectorAll('article div.l.er.ib > a:nth-child(1)')

    const articles: Article[] = []

    let obj: Article = {}

    function checkObjectKey<T>(obj: T, key: keyof T) {
      if(obj[key] === undefined) return true
      else return false
    }

    function setObjectKey<T>(obj: T, key: keyof T, value: T[keyof T]) {
      if(checkObjectKey<T>(obj, key)) obj[key] = value
      else resetObject()
    }

    function resetObject() {
      articles.push(obj)
      obj = {}
    }

    elements.forEach((el) => {
      switch(el.nodeName) {
        case 'A':
          setObjectKey(obj, 'link', (el as any).href)
          break;
        case 'H2':
          setObjectKey(obj, 'title', el.innerHTML)
          break;
        case 'H3':
          setObjectKey(obj, 'description', el.innerHTML)
          break;
        case 'P':
          setObjectKey(obj, 'editor', el.innerHTML)
          break;
        case 'IMG':
          if(el.className === 'l hs bx hn ho ec') {
            setObjectKey(obj, 'avatarImageUrl', (el as any).src)
          } else if(el.className === 'bw lh') {
            setObjectKey(obj, 'mainImageUrl', (el as any).src)
          }
          break;
        default:
          break;
      }
    })
    return articles
  })
  console.log(articles)
  await browser.close()
})()