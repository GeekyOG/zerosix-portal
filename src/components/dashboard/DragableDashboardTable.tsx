import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";
import ActionButtons from "./ActionButtons";

interface DashboardTableProps {
  columns: ColumnsType;
  data: any[];
  isFetching: boolean;
  isError?: boolean;
  type: string;
  callBackAction?: () => void;
  onPositionUpdate?: (id: string | number, position: number) => Promise<void>;
}

// Drag handle + sortable row
function SortableRow({ children, id, ...props }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "#fafafa" : undefined,
  };

  return (
    <tr ref={setNodeRef} style={style} {...props}>
      {React.Children.map(children, (child) => {
        if (child?.key === "drag-handle") {
          return React.cloneElement(child, {
            children: (
              <HolderOutlined
                ref={setActivatorNodeRef}
                style={{ cursor: "grab", color: "#999", fontSize: 16 }}
                {...listeners}
                {...attributes}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
}

function DashboardTable({
  columns,
  data,
  isFetching,
  type,
  callBackAction,
  onPositionUpdate,
}: DashboardTableProps) {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [updatingIds, setUpdatingIds] = useState<Set<string | number>>(
    new Set(),
  );

  useEffect(() => {
    // Sort by position on load
    const sorted = [...data].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0),
    );
    setDataSource(sorted);
  }, [data]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = dataSource.findIndex((i) => i.id === active.id);
    const newIndex = dataSource.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(dataSource, oldIndex, newIndex);

    // Optimistic update
    setDataSource(reordered);

    // Call update endpoint for each item whose position changed
    const updates = reordered
      .map((item, index) => ({ ...item, newPosition: index + 1 }))
      .filter((item) => item.newPosition !== item.position);

    if (onPositionUpdate && updates.length > 0) {
      const ids = new Set(updates.map((u) => u.id));
      setUpdatingIds(ids);
      try {
        await Promise.all(
          updates.map((item) => onPositionUpdate(item.id, item.newPosition)),
        );
      } finally {
        setUpdatingIds(new Set());
      }
    }
  };

  const columnWithAction: ColumnsType = [
    {
      title: "",
      dataIndex: "drag-handle",
      key: "drag-handle",
      width: 40,
      render: () => null, // replaced inside SortableRow
    },
    ...columns,
    {
      title: "Actions",
      dataIndex: "action",
      render: (_, record) => (
        <ActionButtons
          callBackAction={callBackAction}
          type={type}
          id={record.id}
        />
      ),
    },
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={dataSource.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          columns={columnWithAction}
          dataSource={dataSource}
          pagination={false}
          className="w-[100%] border-[1px]"
          loading={isFetching}
          rowKey="id"
          rowClassName={(record) =>
            updatingIds.has(record.id)
              ? "custom-table-row opacity-60"
              : "custom-table-row"
          }
          components={{
            body: {
              row: ({ children, ...props }: any) => {
                const rowId = props["data-row-key"];
                return (
                  <SortableRow id={rowId} {...props}>
                    {children}
                  </SortableRow>
                );
              },
            },
          }}
        />
      </SortableContext>
    </DndContext>
  );
}

export default DashboardTable;
