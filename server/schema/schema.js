const graphql = require('graphql')
const directors = require('../dbMock/directors')
const movies = require('../dbMock/movies')

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLSchema, GraphQLList } = graphql


const movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: {
            type: directorType,
            resolve(parent, args) {
                return directors.find(director => director.id === parent.id)
            }
        }
    })
})

const directorType = new GraphQLObjectType({
    name: 'Directors',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        movies: {
            type: new GraphQLList(movieType),
            resolve(parent, args) {
                return movies.filter(movie => movie.directorId == parent.id)
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: directorType,
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return directors.push(args)
            }
        }
    }
})
const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: movieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return movies.find(movie => movie.id === args.id)
            }
        },
        director: {
            type: directorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return directors.find(director => director.id === args.id)
            }
        },
        movies: {
            type: GraphQLList(movieType),
            resolve() {
                return movies
            }
        },
        directors: {
            type: GraphQLList(directorType),
            resolve() {
                return directors
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})
