const faker = require('faker')

exports.seed = function (knex) {
    const fakerFiles = Array(20).fill('')
        .map(() => ({
            name: faker.system.fileName(),
            path: faker.lorem.words().split(' ').join('/')
        }))

    return knex('files').del()
        .then(function () {
            return knex('files').insert([
                ...fakerFiles,
                {
                    name:'file1.png',
                    path:'dir1'
                },
                {
                    name:'file2.png',
                    path:'dir1'
                },
                {
                    name:'file1.png',
                    path:'dir1/dir2'
                },
                {
                    name:'file2.png',
                    path:'dir1/dir2'
                }
            ])
        })
}
