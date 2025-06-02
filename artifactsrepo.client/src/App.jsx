import { useState, useEffect } from 'react'
import './App.css'
import CategoryTree from './components/CategoryTree'
import ArtifactList from './components/ArtifactList'
import { Layout, ConfigProvider, theme, App as AntApp } from 'antd'

const { Header, Sider, Content } = Layout

function App() {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [treeExpandedKeys, setTreeExpandedKeys] = useState([])
    const [defaultExpanded, setDefaultExpanded] = useState(false)
    const [updateTrigger, setUpdateTrigger] = useState(0)

    const handleDataUpdate = () => {
        setUpdateTrigger(prev => prev + 1)
    }

    return (
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <AntApp>
                <Layout className="app-layout">
                    <Header className="header">
                        <h1>Software Development Artifacts Repository</h1>
                    </Header>
                    <Layout>
                        <Sider width={300} className="sidebar">
                            <CategoryTree
                                onSelectCategory={setSelectedCategory}
                                expandedKeys={treeExpandedKeys}
                                onExpandedKeysChange={setTreeExpandedKeys}
                                defaultExpanded={defaultExpanded}
                                onDefaultExpandedChange={setDefaultExpanded}
                                updateTrigger={updateTrigger}
                                onDataUpdate={handleDataUpdate}
                            />
                        </Sider>
                        <Content className="content">
                            <ArtifactList
                                selectedCategory={selectedCategory}
                                updateTrigger={updateTrigger}
                                onDataUpdate={handleDataUpdate}
                            />
                        </Content>
                    </Layout>
                </Layout>
            </AntApp>
        </ConfigProvider>
    )
}

export default App