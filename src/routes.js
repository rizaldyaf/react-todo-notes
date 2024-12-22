import example from "./pages/example";

const routes = [
    {
        title:"Notes",
        path:"/notes/:id",
        icon:<>&#xe70b;</>,
        component:example
    },
    {
        title:"Checklists",
        path:"/checklists/:id",
        icon:<>&#xeadf;</>,
        component:example
    },
    {
        title:"Boards",
        path:"/boards/:id",
        icon:<>&#xf0e2;</>,
        component:example
    }
]

export default routes