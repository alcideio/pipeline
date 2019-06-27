#!/bin/bash

build() {
    if [[ ! -d node_modules ]]; then
        echo "Installing dependencies"
        npm install --no-bin-links
    fi

    for task in tasks/*; do
        echo "Building task ${task}"
    
        pushd . &> /dev/null && cd "$task"
        if [[ ! -d node_modules ]]; then
            echo "Installing dependencies"
            npm install --no-bin-links

            # Make a copy that changes symlinks to hard copies
            rsync --archive --verbose --copy-links ./node_modules/ ./node_modules_cp/

            # Remove and replace
            rm -r ./node_modules/
            mv ./node_modules_cp/ ./node_modules/            
        fi

    
        tsc --extendedDiagnostics
        popd &> /dev/null
    done
    
    tfx extension create --manifest-globs vss-extension.json --trace-level info
}

test() {
    for task in tasks/*; do
        echo "Testing task ${task}"
    
        pushd . &> /dev/null && cd "$task"
        mocha  tests/_suite.js  
        
        popd &> /dev/null
    done    
}

publish() {
    tfx extension publish --manifest-globs vss-extension.json --share-with "${ACCOUNT}" --token "${ACCESS_TOKEN}" --no-prompt --json
}

usage() {
    echo "${0} [bp]"
}

while getopts ":bpt" opt; do
    case "${opt}" in
        b)
            build
            ;;
        t)
            test
            ;;            
        p)
            publish
            ;;
        ?)
            usage
            ;;
    esac
done
