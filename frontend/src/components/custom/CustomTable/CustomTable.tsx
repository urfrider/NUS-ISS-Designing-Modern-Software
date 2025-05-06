import React from "react";
import { Table, TableProps } from "antd";
import { useDesignToken } from "../../../DesignToken";

interface CustomTableProps<T> extends TableProps<T> {
  headerBackgroundColor?: string;
  rowBackgroundColor?: string;
  outerBorderColor?: string;
  components?: any;
}

function CustomTable<T extends object>({
  headerBackgroundColor,
  rowBackgroundColor,
  outerBorderColor,
  className,
  style,
  components,
  ...rest
}: CustomTableProps<T>) {
  const token = useDesignToken();

  // Default styling using token values
  const tableStyle = {
    border: `1px solid ${outerBorderColor || token.colorBgWhite}`,
    borderRadius: token.borderRadiusMed,
    overflow: "hidden",
    ...style,
  };

  // Custom table components to style header and rows
  const customComponents = {
    ...components,
    header: {
      ...components?.header,
      cell: (props: any) => {
        const cellStyle = {
          ...props.style,
          backgroundColor: headerBackgroundColor || token.colorBgBase,
        };

        return React.createElement(
          components?.header?.cell || "th",
          { ...props, style: cellStyle },
          props.children
        );
      },
    },
    body: {
      ...components?.body,
      row: (props: any) => {
        // Apply custom row background if provided
        if (rowBackgroundColor) {
          props.style = {
            ...props.style,
            backgroundColor: rowBackgroundColor,
          };
        }

        return React.createElement(
          components?.body?.row || "tr",
          props,
          props.children
        );
      },
    },
  };

  return (
    <Table<T>
      className={className}
      style={tableStyle}
      components={customComponents}
      {...rest}
    />
  );
}

export default CustomTable;
