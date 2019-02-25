export default {
    entry: 'entry.js',
    targets: [{
        dest: 'bundle.js',
        format: 'iife',
        modulesName: 'rollupBundle'
    }]
}