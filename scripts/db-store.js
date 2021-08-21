// Menu: Database Read/Write Example
// Description: Add/remove items from a list of fruit

let fruitDb = await db(["apple", "banana", "orange"])

while (true) {
  let fruitToAdd = await arg(
    "Add a fruit",
    md(fruitDb.items.map(fruit => `* ${fruit}`).join("\n"))
  )

  fruitDb.items.push(fruitToAdd)
  await fruitDb.write()

  let fruitToDelete = await arg(
    "Delete a fruit",
    fruitDb.items
  )

  fruitDb.items = fruitDb.items.filter(
    fruit => fruit !== fruitToDelete
  )

  await fruitDb.write()
}
