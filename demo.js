/*
// regpack options
{
  withMath: false,
  hash2DContext: true,
  hashWebGLContext: true,
  hashAudioContext: true,
  contextVariableName: "c",
  contextType: 0,
  reassignVars: true,
  varsNotReassigned: "a b c d", // js1024
  crushGainFactor: 8,
  crushLengthFactor: 18,
  crushCopiesFactor: 20,
  crushTiebreakerFactor: 1,
  wrapInSetInterval: false,
  timeVariableName: "t",
  useES6: true
}
*/

p=[]
F=400
V=650
W=220
N=100
B=t=0
S=16
T=30
Q=1500
f=.2

X=[
    [W,W,N],
    [N,W,W],
    [W,W,W],
    [W,S,S]
]

dr=(q,p,m,l,t,A)=>{
    for(g=2;g--;)
        for(j=0,k=p;j<(t?l:g?l:1);k++){
            K=(q[k].y>=Q?40:0)*Math.sin(j+++t*.06)
            z = q[k].z -t*f+K
            if(g) {
                q[k].X=F*(q[k].x)/z + a.width/2
                q[k].Y=F*(q[k].y+K)/z + (t?a.height/2:N)
            } else {
                Z|=z <= N
                C=X[q[k].c]

                e=q[k+m].y-q[k].y
                d=q[k+m].z-q[k].z
                h=q[k+1].x-q[k].x
                u=[e-d*(q[k+1].y-q[k].y), d*h, -e*h]
                u=u.map(e=>e/Math.sqrt(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]))
                
                u=.4+.6*(u[0]*f+(t?u[1]:u[1]*f+u[2]))
                c.fillStyle='rgba(' + C[0]*u + ',' + C[1]*u + ',' + C[2]*u + ','+A+')'
                
                c.beginPath()
                c.lineTo(q[k].X,    q[k].Y)
                c.lineTo(q[k+1].X,  q[k+1].Y)
                c.lineTo(q[k+m+1].X,q[k+m+1].Y)
                c.lineTo(q[k+m].X,  q[k+m].Y)
                c.fill()
            }
        }
}

setInterval(()=>{
    c.fillStyle='#28a'
    c.fillRect(0,0,a.width,a.height)

    //small cloud! =)
    // c.fillStyle='rgba(255,255,255,.5)'
    // for(i=S;i;){
    //     k=Math.sin(i--*S+t*.0001)
    //     c.beginPath()
    //     c.arc(N+i*8,N+S*k,T+T*k,0,6)
    //     c.fill()
    // }

    for(;(A=p.length)<N*N;B++) {
        for(j=0;j++<N;){
            k=j-N/2
            h=N/Math.abs(k)
            p.push({x: k*N + W*Math.sin(B*f), y:(Math.random()/2+.3*(h>10?10:h))*1050-Q, z: F+B * N, c:0})
        }

        for(Z=3;--Z;)
            for(j=0;B>1&&j<N;) {
                k=A-N+j++
                p[k].y=(p[k].y + p[k-1].y + p[k-N].y)/3
                p[k].c=p[k].y<W?2:p[k].y<Q?0:1
            }
    }

    for(i=A/N-2;i--;) dr(p,i*N,N,N-1,t++,1-i*N/A)
    if(Z) p=p.slice(N)

    for(;++i<=S;)
        for(n=S;n--;){
            x=2+n%2

            g=Math.cos(n*f)
            h=Math.cos(n*f+f)
            e=Math.sin(n*f)
            d=Math.sin(n*f+f)
            s=W*Math.sin(i*f)
            b=W*Math.sin(i*f+f)

            dr([{x:s*g,  y:i*T,   z:s*e+V, c:x},
                {x:s*h,  y:i*T,   z:s*d+V, c:x},
                {x:b*g,  y:i*T+T, z:b*e+V, c:x},
                {x:b*h,  y:i*T+T, z:b*d+V, c:x}],0,2,4,0,1)
        }
})