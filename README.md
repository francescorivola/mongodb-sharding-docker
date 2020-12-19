# mongodb-sharding-docker

Step 1: start the mongo databases

```sh
docker-compose up
or
docker-compose up -d
```

Step 2: exec into one of the mongos:

docker exec -it rs-sh1-01 /bin/bash
Step 3: access mongo console

```sh
mongo --port 27011
```

Step 4: configure replica set by pasting the following

```javascript
rs.initiate(
  {
    _id : 'rs-sh1',
    members: [
      { _id : 0, host : "rs-sh1-01:27011" },
      { _id : 1, host : "rs-sh1-02:27012" },
      { _id : 2, host : "rs-sh1-03:27013" }
    ]
  }
)
```

Etc hosts entries
```
127.0.0.1       rs-sh1-01
127.0.0.1       rs-sh1-02
127.0.0.1       rs-sh1-03
127.0.0.1       rs-sh2-01
127.0.0.1       rs-sh2-02
127.0.0.1       rs-sh2-03
127.0.0.1       rs-config-01
127.0.0.1       rs-config-02
127.0.0.1       rs-config-03
```

https://docs.mongodb.com/manual/tutorial/convert-replica-set-to-replicated-shard-cluster/

For PSA architecture

```javascript
rs.initiate(
  {
    _id : 'rs-sh1',
    members: [
      { _id : 0, host : "rs-sh1-01:27011" },
      { _id : 1, host : "rs-sh1-02:27012" },
      { _id : 2, host : "rs-sh1-03:27013", arbiterOnly: true }
    ]
  }
)
```

For config replica set

```javascript
rs.initiate(
  {
    _id : 'rs-config',
    configsvr: true,
    members: [
      { _id : 0, host : "rs-config-01:27017" },
      { _id : 1, host : "rs-config-02:27018" },
      { _id : 2, host : "rs-config-03:27019" }
    ]
  }
)
```

```javascript
use admin
sh.addShard( "rs-sh1/rs-sh1-01:27011,rs-sh1-02:27012,rs-sh1-03:27013" )
```

```javascript
rs.initiate(
  {
    _id : 'rs-sh2',
    members: [
      { _id : 0, host : "rs-sh2-01:27014" },
      { _id : 1, host : "rs-sh2-02:27015" },
      { _id : 2, host : "rs-sh2-03:27016" }
    ]
  }
)
```


```javascript
use admin
sh.addShard( "rs-sh2/rs-sh2-01:27014,rs-sh2-02:27015,rs-sh2-03:27016" )
```

Enabled shard at database level

```javascript
sh.enableSharding( "test" )
```

Shard a collection

Create index for partition key

```
use test
db.messages.createIndex( { type : 1 } )
```

Let's shard a collection
```
use test
sh.shardCollection( "test.messages", { "type" : 1 } )
```