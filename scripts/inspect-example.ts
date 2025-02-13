let response = await get("https://swapi.dev/api/people/1/")
await inspect(response.data)