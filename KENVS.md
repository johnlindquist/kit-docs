---
slug: kenvs
title: "Kenvs"
sidebar_position: 4
---

# Kenvs

Credit for this page goes to [BeSpunky](https://gist.github.com/BeSpunky/4595a7a783b74802b8cb5301d91efa55).

## Concepts And Terminology

A `kenv`, short for `kit environment`, in Script Kit is a directory containing a `scripts` directory, allowing the Script Kit application to identify where to look for scripts. This term comes from the idea of project environments in other languages like Python (pyenv) and Ruby (rbenv).

While a `kenv` only requires a `scripts` directory, other directories like `lib`, `db`, `logs`, etc. can be included for organization and utility purposes. These are not mandatory and depend on the user's preferences and needs. However, once Script Kit identifies the scripts in a `scripts` directory, it can watch, build, and run scripts while generating relevant materials like database files, logs, and so on.

```
my-kenv/  
├── scripts/  
├── lib/  
├── db/  
├── logs/
```

Script Kit doesn't impose any restrictions on the scripts; they are just Node.js scripts. The only special aspect of Script Kit is the global helpers it injects to enhance script development.

## Main vs Secondary Kenvs

When Script Kit is installed, it creates a 'main' kenv in the `<user folder>/.kenv` directory. This main kenv acts as the root project directory for Script Kit.

Secondary kenvs can be created inside the `kenvs` folder located in the main kenv directory (`<user folder>/.kenv/kenvs/`). These secondary kenvs allow users to group scripts and share them between different work environments or users.

```
.kenv/
├── scripts/
├── lib/
├── kenvs/
│   ├── secondary-kenv1/
│   │   ├── scripts/
│   │   ├── lib/
│   ├── secondary-kenv2/
│   │   ├── scripts/
│   │   ├── lib/
```

## Installation and Initialization

Script Kit doesn't automatically initialize Git when a kenv is created. This is because Script Kit follows a "Don't assume anything about the users' environment" philosophy. However, Git is implicitly suggested for version control, as observed from the `.gitignore` file generated with a new kenv and the ability to clone a kenv from a Git repository.

In the future, Script Kit plans to bundle isomorphic-git to perform basic Git commands even if the user doesn't have Git installed. Also, adding a "git init" prompt to the "new kenv" actions is being considered.

## How Kenvs Operate

Script Kit actively watches the `scripts` and `lib` folders of a kenv to detect changes. Any changes made in these directories trigger a rebuild of the scripts, making the updated versions immediately accessible through Script Kit's user interface.

## Managing Kenvs

In Script Kit, you can perform a number of actions to manage your kenvs. You can use the Script Kit UI or handle these tasks manually.

### Cloning a Kenv Repo

You can clone a kenv repository to create a secondary kenv in your main kenv. This allows you to use and modify scripts from other users or your other workstations.

**Placeholder for illustration image**

### Creating a New Local Kenv

If you want to start a new set of scripts that are isolated from your main kenv, you can create a new local kenv. This is similar to creating a new project or a new workspace.

**Placeholder for illustration image**

### Removing Kenvs

If a kenv is no longer needed, you can remove it from your system. This will delete all scripts and related files in that kenv.

**Placeholder for illustration image**

### Pushing and Pulling a Cloned Kenv

If you have cloned a kenv from a git repository, you can push your changes to the remote repository or pull updates from it. This is useful when you're collaborating with others on a script or a set of scripts.

**Placeholder for illustration image**

### Linking Folders as Kenvs

You can link any folder on your system as a kenv as long as it contains a `scripts` directory. This allows you to run scripts located outside the main kenv or any secondary kenvs.

**Placeholder for illustration image**

### Unlinking Folders from Kenvs

If a linked folder is no longer needed as a kenv, you can unlink it. Unlinking a folder does not delete the folder or its content, it only removes the link from Script Kit.

**Placeholder for illustration image**

## How to Use

Once you have set up your kenvs, you can start using them. The scripts in your main kenv and secondary kenvs will be available in the Script Kit interface for you to run.

To run a script from another kenv, you can use the `kenvPath()` function like so:

`let scriptPath = kenvPath('kenvs', 'my-kenv', 'scripts', 'my-script.js')`

If you need a utility function from a kenv's lib folder, you can import it using relative imports. For example, to import a function named `doMagic` from a file in a secondary kenv, you would write:

`import { doMagic } from '../kenvs/my-kenv/lib/my-file'`

Script Kit will automatically rebuild the scripts in your kenvs when changes are made, so the latest version of the scripts will always be available in the Script Kit interface.

## Roadmap

Script Kit is looking at introducing the following features in the future:

-   **Automatic GitHub Syncing:** While it's a long way off, the team is considering automatic syncing with GitHub to make version control and script sharing easier.
-   **Trusted Kenvs:** This feature would allow the app to run scripts automatically based on their metadata. This is intended to prevent users from accidentally downloading malicious kenvs and running scripts without their knowledge.
-   **GitHub Repo Creation:** Script Kit is exploring the idea of leveraging GitHub's repo creation URL to allow users to create repositories directly from the app.

Remember, Script Kit is a flexible tool designed to adapt to your workflow, so feel free to experiment and find