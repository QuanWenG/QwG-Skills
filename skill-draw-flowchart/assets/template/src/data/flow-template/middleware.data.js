export const MIDDLEWARE_NODES = [
  {
    id: 'mq',
    type: 'rect',
    x: 1430,
    y: 220,
    text: 'MQ',
    properties: {
      role: 'middleware',
      group: 'middleware/mq',
      category: 'mq',
      prompt: 'ActiveMQ、RabbitMQ、RocketMQ、Kafka。',
      note: '具体业务链路中用 publish/consume 箭头连接。',
    },
  },
  {
    id: 'redis',
    type: 'rect',
    x: 1430,
    y: 400,
    text: 'Redis',
    properties: {
      role: 'middleware',
      group: 'middleware/redis',
      category: 'cache',
      prompt: 'zset、geo、pipeline 等缓存能力。',
      note: '',
    },
  },
  {
    id: 'sharding',
    type: 'rect',
    x: 1430,
    y: 580,
    text: '分库分表',
    properties: {
      role: 'middleware',
      group: 'middleware/sharding',
      category: 'sharding',
      prompt: 'TDDL、Atlas、Sharding JDBC、Mycat。',
      note: '',
    },
  },
]

