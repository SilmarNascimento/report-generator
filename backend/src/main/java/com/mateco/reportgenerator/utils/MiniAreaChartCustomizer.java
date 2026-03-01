package com.mateco.reportgenerator.utils;

import net.sf.jasperreports.engine.JRChart;
import net.sf.jasperreports.engine.JRChartCustomizer;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.CategoryAxis;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.axis.NumberTickUnit;
import org.jfree.chart.labels.ItemLabelAnchor;
import org.jfree.chart.labels.ItemLabelPosition;
import org.jfree.chart.labels.StandardCategoryItemLabelGenerator;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.renderer.category.LineAndShapeRenderer;
import org.jfree.ui.RectangleInsets;
import org.jfree.ui.TextAnchor;

import java.awt.*;
import java.awt.geom.Ellipse2D;
import java.text.NumberFormat;

public class MiniAreaChartCustomizer implements JRChartCustomizer {
    @Override
    public void customize(JFreeChart chart, JRChart jasperChart) {
        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(Color.WHITE);
        plot.setOutlineVisible(false);

        plot.setInsets(new RectangleInsets(0.0, 0.0, 0.0, 5.0));

        // ==========================================
        // EIXO Y (Matemática de Precisão)
        // ==========================================
        NumberAxis yAxis = (NumberAxis) plot.getRangeAxis();
        yAxis.setVisible(false);

        yAxis.setRange(-5, 115.0);

        yAxis.setTickUnit(new NumberTickUnit(25.0));

        plot.setRangeGridlinesVisible(true);
        plot.setRangeGridlinePaint(Color.decode("#DCDCDC"));
        plot.setRangeGridlineStroke(new BasicStroke(1.0f));
        plot.setDomainGridlinesVisible(false);

        // ==========================================
        // EIXO X (A Linha Fantasma)
        // ==========================================
        CategoryAxis xAxis = plot.getDomainAxis();

        // DESLIGAMOS a linha física do Eixo X.
        // A linha de grade do "0%" (gerada pelo eixo Y) vai servir como o novo "chão" visual!
        xAxis.setAxisLineVisible(false);

        xAxis.setTickMarksVisible(false);
        xAxis.setTickLabelsVisible(true);
        xAxis.setTickLabelFont(new Font("SansSerif", Font.PLAIN, 8));
        xAxis.setTickLabelPaint(Color.BLACK);
        xAxis.setLowerMargin(0.05);
        xAxis.setUpperMargin(0.05);

        // ==========================================
        // RENDERIZADOR
        // ==========================================
        LineAndShapeRenderer renderer = (LineAndShapeRenderer) plot.getRenderer();
        renderer.setBaseLinesVisible(true);
        renderer.setBaseShapesVisible(true);

        Color corAzul = Color.decode("#4172c6");
        renderer.setSeriesPaint(0, corAzul);
        renderer.setSeriesStroke(0, new BasicStroke(2.0f));

        renderer.setSeriesShape(0, new Ellipse2D.Double(-2.5, -2.5, 5.0, 5.0));
        renderer.setUseFillPaint(true);
        renderer.setSeriesFillPaint(0, corAzul);

        renderer.setSeriesItemLabelGenerator(0, new StandardCategoryItemLabelGenerator("{2}%", NumberFormat.getIntegerInstance()));
        renderer.setSeriesItemLabelsVisible(0, true);
        renderer.setSeriesItemLabelPaint(0, Color.BLACK);
        renderer.setSeriesItemLabelFont(0, new Font("SansSerif", Font.PLAIN, 9));

        ItemLabelPosition position = new ItemLabelPosition(
                ItemLabelAnchor.OUTSIDE12, TextAnchor.BOTTOM_CENTER, TextAnchor.BOTTOM_CENTER, 0.0
        );
        renderer.setSeriesPositiveItemLabelPosition(0, position);
        renderer.setItemLabelAnchorOffset(2.5);
    }
}