<a name="top"></a>
# Script Kit Documentation

This repository contains documentation for [Script Kit](https://scriptkit.com).

https://johnlindquist.github.io/kit-docs/

Welcome to the kit-docs repository! 
This repo hosts the documentation for [Script Kit](https://scriptkit.com/), an intuitive scripting toolkit 
designed to make scripting accessible and fun for developers of all skill levels.

> [!TIP]
> ### Quick Access in Script Kit
> You can quickly search the documentation directly from within Script Kit. Simply type `docs ` followed by a space, tab to
> a section, and then enter your search query. This feature allows you to conveniently explore the documentation right
> when and where you need it.

## Repository Structure

- `/` - The repository root contains the Markdown files for all the documentation. If you're looking to contribute or edit 
  the docs, this is where you'll find the files. Due to backwards compatibility with already released Kit versions, we cannot 
  create a dedicated `/docs` folder (see hardcoded file names in [download-md.ts](https://github.com/johnlindquist/kit/blob/main/src/cli/download-md.ts))
- `/host` - This directory houses the [Docusaurus](https://docusaurus.io/) setup used to generate the documentation site. Docusaurus is a modern static website generator.

Some markdown files at the repo root, such as this `README.md`, are ignored. See the `exclude` declaration in 
[host/docusaurus.config.mts](https://github.com/johnlindquist/kit-docs/blob/main/host/docusaurus.config.ts) for details.

## Installation

To work with the documentation, you need to set up Docusaurus. This project uses modern [Yarn](https://yarnpkg.com/) 
as package manager. Here's how you can get started:

1. We're assuming you have any Yarn executable installed on your machine.

2. Navigate to the `/host` directory:

    ```bash
    cd host
    ```

3. Install the necessary dependencies:

    ```bash
    yarn install
    ```

4. To start the local development server, run:

    ```bash
    yarn start
    ```

This will launch a local copy of the docs, allowing you to see your changes in real-time.

## Contributing

Contributions to the Script Kit Docs are always welcome, whether it's editing existing documentation or adding new 
content. Please feel free to make a pull request or open an issue if you have suggestions or find any problems.

## Using the Repository as a Kenv

Interestingly, this repository is also technically a kenv, which means you can install it in Script Kit as such. 
This makes it easier (for the maintainers) to manage and utilize scripts directly related to the documentation process.


-----

**Thank you for contributing to the Script Kit documentation!**

[⬆️ Back to top](#top)
