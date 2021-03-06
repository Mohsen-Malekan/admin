export default function pieData(report, data) {
  const length = data.cols.length === 0 ? 0 : data.cols.length - 1;
  const series = Array(length).fill({
    type: "pie",
    radius: [0, "75%"],
    roseType: false
  });

  return {
    dataset: {
      dimensions: data.cols.map(c => c.key),
      source: data.rows.map(r => r.cols)
    },
    series
  };
}
