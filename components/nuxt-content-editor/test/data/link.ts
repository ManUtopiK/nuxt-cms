export const mdLink = `It is a raw link https://example.com and [another](https://example.com).`


export const proseLink = {
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "It is a raw link "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "link",
              "attrs": {
                "href": "https://example.com",
                "target": "_blank",
                "class": null
              }
            }
          ],
          "text": "https://example.com"
        },
        {
          "type": "text",
          "text": " and "
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "link",
              "attrs": {
                "href": "https://example.com",
                "target": "_blank",
                "class": null
              }
            }
          ],
          "text": "another"
        },
        {
          "type": "text",
          "text": "."
        }
      ]
    }
  ]
}
