import { GenericContainer, Network, Wait } from "testcontainers";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import pg from 'pg'
const { Client } = pg;

const logger = {
  info: function (...args) {
    console.log(...arguments)
  }
}

const postgresNetwork = await new Network().start();
const postgresContainer = await new PostgreSqlContainer()
  .withNetwork(postgresNetwork)
  .withNetworkAliases('db')
  .withExposedPorts(5432)
  .start();


const client = new Client({
  host: postgresContainer.getHost(),
  port: postgresContainer.getPort(),
  database: postgresContainer.getDatabase(),
  user: postgresContainer.getUsername(),
  password: postgresContainer.getPassword()
});
await client.connect();
logger.info('local client connected!');// -> this is printed everything is as it should be LOCALLY

const catalogServiceContainer = await new GenericContainer('catalog-service:test')
  .withNetwork(postgresNetwork)
  .withEnvironment({
    PG_HOST: 'db',
    PG_PORT: 5432,
    PG_DATABASE: postgresContainer.getDatabase(),
    PG_USER: postgresContainer.getUsername(),
    PG_PASSWORD: postgresContainer.getPassword(),
  })
  .withLogConsumer(stream => stream.on("data", console.log))
  .withExposedPorts(8082)
  .withWaitStrategy(Wait.forLogMessage("connected"))
  .start();

logger.info('init catalogService ...', catalogServiceContainer.getHost());
