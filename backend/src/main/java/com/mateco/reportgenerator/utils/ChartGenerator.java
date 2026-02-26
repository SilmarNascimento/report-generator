package com.mateco.reportgenerator.utils;

import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.geom.Arc2D;
import java.awt.geom.Path2D;
import java.awt.image.BufferedImage;

public class ChartGenerator {

    public static BufferedImage createDoughnutGauge(double scoreValue) {
        // Coordenadas base (lógicas)
        int baseWidth = 400;
        int baseHeight = 230;

        // Fator de escala (4x = resolução altíssima para o PDF)
        int scale = 4;

        // Tamanho físico real da imagem gerada (1600 x 920)
        BufferedImage img = new BufferedImage(baseWidth * scale, baseHeight * scale, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = img.createGraphics();

        // Configurações máximas de qualidade e suavização
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_PURE);
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);

        // MÁGICA: Escala o pincel do Java para desenhar tudo 4x maior
        // sem precisarmos alterar uma única linha da nossa matemática original!
        g2d.scale(scale, scale);

        int cx = baseWidth / 2;
        int cy = 200;
        int outerRadius = 180;
        int thickness = 50;

        // 1. Desenha as fatias do gráfico (Total: 180 graus)

        // Vermelho (40% -> 72 graus)
        drawArc(g2d, cx, cy, outerRadius, thickness, 180, -72, Color.decode("#C00000"));
        // Amarelo (15% -> 27 graus)
        drawArc(g2d, cx, cy, outerRadius, thickness, 108, -27, Color.decode("#ffd966"));
        // Verde Claro (15% -> 27 graus)
        drawArc(g2d, cx, cy, outerRadius, thickness, 81, -27, Color.decode("#A9D18E"));
        // Verde Escuro (30% -> 54 graus)
        drawArc(g2d, cx, cy, outerRadius, thickness, 54, -54, Color.decode("#00B050"));
        // 2. Desenha a agulha fazendo o recorte
        drawNeedleWithGap(g2d, scoreValue, cx, cy, outerRadius);

        g2d.dispose();
        return img;
    }

    private static void drawArc(Graphics2D g2d, int cx, int cy, int radius, int thickness, int startAngle, int extent, Color color) {
        int drawRadius = radius - (thickness / 2);
        int x = cx - drawRadius;
        int y = cy - drawRadius;
        int w = drawRadius * 2;
        int h = drawRadius * 2;

        g2d.setStroke(new BasicStroke(thickness, BasicStroke.CAP_BUTT, BasicStroke.JOIN_MITER));
        g2d.setColor(color);
        g2d.draw(new Arc2D.Double(x, y, w, h, startAngle, extent, Arc2D.OPEN));
    }

    private static void drawNeedleWithGap(Graphics2D g2d, double score, int cx, int cy, int needleLength) {
        double safeScore = Math.max(0, Math.min(100, score));
        double angle = Math.PI - (safeScore / 100.0) * Math.PI;

        AffineTransform oldTransform = g2d.getTransform();

        g2d.translate(cx, cy);
        g2d.rotate(-angle);

        int innerOffset = 55;

        int gapPadding = 7;
        Path2D.Double gap = new Path2D.Double();
        gap.moveTo(innerOffset - 2, 0);
        gap.lineTo(needleLength + 2, 4 + gapPadding);
        gap.lineTo(needleLength + 2, -(4 + gapPadding));
        gap.closePath();

        Composite originalComposite = g2d.getComposite();
        g2d.setComposite(AlphaComposite.Clear);
        g2d.fill(gap);
        g2d.setComposite(originalComposite);

        Path2D.Double needle = new Path2D.Double();
        needle.moveTo(innerOffset, 0);
        needle.lineTo(needleLength, 4);
        needle.lineTo(needleLength, -4);
        needle.closePath();

        g2d.setColor(Color.BLACK);
        g2d.fill(needle);

        g2d.setTransform(oldTransform);
    }
}