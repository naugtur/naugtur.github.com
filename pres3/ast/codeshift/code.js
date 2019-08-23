const egnyte = require("egnyte-js-sdk");

egnyte.API.storage
    .fileId(input.data.id)
    .get()
    .then(function (fileMetadata) {
        currentPath = fileMetadata.path;
        return newPathForRename.get(egnyte, currentPath, requestedName);
    })
    .then(function (newPath) {
        return egnyte.API.storage
            .customizeRequest(function (opts) {
                if (!opts.json) {
                    opts.json = {};
                }
                var egnyteProofLockToken = egnyteLockAdapter.adaptLockToken(
                    input.data.lockToken
                );

                opts.json.lock_token = egnyteProofLockToken;
                return opts;
            })
            .path(currentPath)
            .move(newPath);
    });