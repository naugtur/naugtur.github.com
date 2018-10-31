---
title: Shared CI config with versioning
author: naugtur
date: 2018-10-31
template: article.jade
tags: English
---

Gitlab CI is one of a bunch of CIs configurable with a file in the repository. With over 25 repositories sharing a similar configuration maintenance becomes annoying.

<cut>

My team is building integrations. We can't seem to stop. There's over 20 of them now and each has a build pipeline.

We even managed to get them to be really consistent in terms of tooling, builds and deployment. `sed` in a loop was my editor of choice for a while. Now with everything reaching consistency, it's time to address the overlap.


## But how? 

`.gitlab-ci.yml` defines the pipeline, so it's not possible to install something external as the first step of the pipeline to affect the rest. `.gitlab-ci.yml` allows importing external files from the repo or a URL. That sounds great. 

External URLs don't support authorization, so we'd have to put some infrastructure in place to have parts of `.gitlab-ci.yml` shared between projects, but not available to general public. You know, security.

Also, if all configs point to the same URL, it's just one version shared across all pipelines. Instant updates or no updates.

The big leap I had to make was to think of `.gitlab-ci.yml` as code not configuration. 

If it's code, I need to reuse it. If I'm reusing code, I put it in a shared library. If I have a library, I version it so I don't have to spend a few days rolling it out to each project with each change, but can do so progressively when revisiting projects while they continue to work fine with previous version.

The idea is not new. We're using internal libraries to reuse code better. Logger, database abstractions etc. - they're all packages we install in each app and their development follows semantic versioning.

## Here's what I did:

### a library

- extract common steps to files
- give them descriptive stage names
- parametrize with variables

I can include a file and use a stage from it, put it in the right order with others etc.
Included stages are configured with variables. Variables from the main yaml are accessible in included code.

### make it installable

- set up a repository for the library as a npm compatible package
- use a `install` script to take a folder with reusable files and copy it to the folder of the app installing my package as dependency

When I install the library at a certain version, I get a folder with reusable yaml in my repo root. Just need to commit it and it can be included in the main `.gitlab-ci.yml`.

We now have full control of the versions. If I want to update the CI pipeline across all apps, I run `npm update gitlabci-shared-config` in a loop across repositories and commit changes. If I need to update the version for only one app, or the update requires changes in the app itself - I have control over how and when the update rolls out.

Also, the generated folder comes with a readme file explaining usage docs matching the installed version and a version file containing the version number so it's easy to spot if/when it goes out of sync.

Here's what it looks like when used

```yaml
variables:
  ...
  CURRENT_NODE_ALPINE: "node:10-alpine"
  GCR_CONTAINER_REGISTRY_NAME: "..."

include: 
  - "/gitlabci-shared-config/dependencies.yml"
  - "/gitlabci-shared-config/build.yml"

stages:
  - setup_dependencies
  - build_image_prod
  - test
  ...

unittesting:
  stage: test
  ...
```

## Known issues

- Unused stages cause errors, each stage needs to be in a separate file with only the used ones included to `.gitlab-ci.yml`
- There's no obvious way to stop someone from editing the installed files - they have to be committed to the repo because there's no step before `.gitlab-ci.yml` includes other than git commit.

## Summary

We've been using this for a few weeks now and It's proving useful for sharing parts of Gitlab CI configuration across 25 independent apps.  

I should post some more tips for dealing with maintenance across many applications without the need of a monorepo. Maybe a series of posts? Let me know on twitter.
