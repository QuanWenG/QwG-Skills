export const STORAGE_NODES = [
  {
    id: 'mysql',
    type: 'rect',
    x: 1810,
    y: 300,
    text: 'MySQL',
    properties: {
      role: 'storage',
      group: 'storage',
      category: 'database',
      prompt: '主库 -> 从库 -> 备库。',
      note: '',
    },
  },
  {
    id: 'fastdfs',
    type: 'rect',
    x: 1810,
    y: 520,
    text: 'FastDFS',
    properties: {
      role: 'storage',
      group: 'storage',
      category: 'file-storage',
      prompt: 'fastdfs 分布式文件集群。',
      note: '',
    },
  },
]

